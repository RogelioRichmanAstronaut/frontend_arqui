// File: components/api-testing-panel.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/(ui)/card';
import { Button } from '@/components/(ui)/button';
import { Input } from '@/components/(ui)/input';
import { Badge } from '@/components/(ui)/badge';
import { Separator } from '@/components/(ui)/separator';
import { toast } from 'sonner';
import { 
  auth, 
  flights, 
  hotels, 
  catalog, 
  clients, 
  cart, 
  checkout, 
  payments,
  health,
  ApiError,
  generateIdempotencyKey 
} from '@/lib/api';

export function ApiTestingPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentToken, setCurrentToken] = useState<string>('');
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentToken(token);
    }
  }, []);

  const setLoadingState = (key: string, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }));
  };

  const setResult = (key: string, result: any) => {
    setTestResults(prev => ({ ...prev, [key]: result }));
  };

  const handleApiCall = async (key: string, fn: () => Promise<any>, description: string) => {
    setLoadingState(key, true);
    try {
      const result = await fn();
      setResult(key, { success: true, data: result, timestamp: new Date().toLocaleString() });
      toast.success(`✅ ${description}: Éxito`);
    } catch (error: any) {
      console.error(`${description} error:`, error);
      const errorData = {
        success: false,
        error: error.message || 'Unknown error',
        status: error.status || 'Unknown',
        timestamp: new Date().toLocaleString()
      };
      setResult(key, errorData);
      toast.error(`❌ ${description}: ${error.message || 'Error'}`);
    } finally {
      setLoadingState(key, false);
    }
  };

  // Authentication tests
  const testLogin = () => handleApiCall('login', async () => {
    const response = await auth.login({
      email: 'empleado@turismo.com',
      password: 'password123'
    });
    
    const token = response.access_token || response.token;
    if (token) {
      localStorage.setItem('auth_token', token);
      setIsAuthenticated(true);
      setCurrentToken(token);
    }
    return response;
  }, 'Login');

  const testLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setCurrentToken('');
    setResult('logout', { success: true, timestamp: new Date().toLocaleString() });
    toast.success('✅ Logout: Éxito');
  };

  // Health tests
  const testHealth = () => handleApiCall('health', () => health.check(), 'Health Check');
  const testReady = () => handleApiCall('ready', () => health.ready(), 'Ready Check');

  // Catalog tests
  const testCities = () => handleApiCall('cities', () => catalog.getCities(), 'Get Cities');

  // Client tests
  const testCreateClient = () => handleApiCall('createClient', async () => {
    const clientId = `CC-${Date.now()}`;
    return await clients.create({
      clientId,
      name: 'Test Client',
      email: 'test@example.com',
      phone: '3001234567'
    });
  }, 'Create Client');

  // Flight tests
  const testFlightSearch = () => handleApiCall('flightSearch', () => 
    flights.search({
      originCityId: 'CO-BOG',
      destinationCityId: 'CO-MDE',
      departureAt: '2025-12-01',
      passengers: 2,
      cabin: 'ECONOMICA'
    }), 'Flight Search');

  // Hotel tests
  const testHotelSearch = () => handleApiCall('hotelSearch', () =>
    hotels.search({
      cityId: 'CO-BOG',
      checkIn: '2025-12-20',
      checkOut: '2025-12-25',
      adults: 2,
      rooms: 1
    }), 'Hotel Search');

  // Cart tests
  const testAddToCart = () => handleApiCall('addToCart', () =>
    cart.addItem({
      clientId: 'CC-1032456789',
      currency: 'COP',
      kind: 'AIR',
      refId: 'flight-test-001',
      quantity: 2,
      price: 450000,
      metadata: {
        flightId: 'test-flight-id',
        passengers: [
          { name: 'Test User', age: 30 }
        ]
      }
    }), 'Add to Cart');

  const testGetCart = () => handleApiCall('getCart', () =>
    cart.get('CC-1032456789'), 'Get Cart');

  const renderTestResult = (key: string, title: string) => {
    const result = testResults[key];
    const isLoading = loading[key];

    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          <span className="text-sm text-gray-600">Testing...</span>
        </div>
      );
    }

    if (!result) return null;

    return (
      <div className="mt-2 p-2 rounded text-xs bg-gray-50">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={result.success ? "default" : "destructive"}>
            {result.success ? "✅ Success" : "❌ Error"}
          </Badge>
          <span className="text-gray-500">{result.timestamp}</span>
        </div>
        {result.success ? (
          <pre className="text-green-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        ) : (
          <div className="text-red-700">
            <div>Status: {result.status}</div>
            <div>Error: {result.error}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🧪 Panel de Pruebas API</span>
          <div className="flex items-center gap-2">
            <Badge variant={isAuthenticated ? "default" : "destructive"}>
              {isAuthenticated ? "🟢 Autenticado" : "🔴 No autenticado"}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Authentication Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">🔐 Autenticación</h3>
          <div className="flex gap-2 mb-2">
            <Button onClick={testLogin} disabled={loading.login} size="sm">
              {loading.login ? "Cargando..." : "Login Test"}
            </Button>
            <Button onClick={testLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
          {renderTestResult('login', 'Login')}
          {currentToken && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
              <strong>Token:</strong> {currentToken.substring(0, 20)}...
            </div>
          )}
        </div>

        <Separator />

        {/* Health Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">💊 Health Checks</h3>
          <div className="flex gap-2 mb-2">
            <Button onClick={testHealth} disabled={loading.health} size="sm">
              Health Check
            </Button>
            <Button onClick={testReady} disabled={loading.ready} size="sm">
              Ready Check
            </Button>
          </div>
          {renderTestResult('health', 'Health')}
          {renderTestResult('ready', 'Ready')}
        </div>

        <Separator />

        {/* Catalog Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">📋 Catálogo</h3>
          <div className="flex gap-2 mb-2">
            <Button onClick={testCities} disabled={loading.cities} size="sm">
              Get Cities
            </Button>
          </div>
          {renderTestResult('cities', 'Cities')}
        </div>

        {/* Booking Services (require auth) */}
        {isAuthenticated && (
          <>
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">👥 Clientes</h3>
              <div className="flex gap-2 mb-2">
                <Button onClick={testCreateClient} disabled={loading.createClient} size="sm">
                  Create Client
                </Button>
              </div>
              {renderTestResult('createClient', 'Create Client')}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">✈️ Vuelos</h3>
              <div className="flex gap-2 mb-2">
                <Button onClick={testFlightSearch} disabled={loading.flightSearch} size="sm">
                  Search Flights
                </Button>
              </div>
              {renderTestResult('flightSearch', 'Flight Search')}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">🏨 Hoteles</h3>
              <div className="flex gap-2 mb-2">
                <Button onClick={testHotelSearch} disabled={loading.hotelSearch} size="sm">
                  Search Hotels
                </Button>
              </div>
              {renderTestResult('hotelSearch', 'Hotel Search')}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">🛒 Carrito</h3>
              <div className="flex gap-2 mb-2">
                <Button onClick={testAddToCart} disabled={loading.addToCart} size="sm">
                  Add to Cart
                </Button>
                <Button onClick={testGetCart} disabled={loading.getCart} size="sm">
                  Get Cart
                </Button>
              </div>
              {renderTestResult('addToCart', 'Add to Cart')}
              {renderTestResult('getCart', 'Get Cart')}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}