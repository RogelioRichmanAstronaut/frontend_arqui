#!/usr/bin/env node

/**
 * Environment Setup Script for Turismo Frontend
 * 
 * This script helps you set up the environment variables for the Turismo application.
 * Run this script to create environment files with the correct configuration.
 * 
 * Usage:
 *   node scripts/setup-env.js [environment]
 *   
 * Examples:
 *   node scripts/setup-env.js           # Sets up local development
 *   node scripts/setup-env.js dev       # Sets up local development  
 *   node scripts/setup-env.js prod      # Sets up production template
 */

const fs = require('fs');
const path = require('path');

const environments = {
  dev: {
    file: '.env.local',
    description: 'Local Development Environment',
    config: {
      'NEXT_PUBLIC_API_URL': 'http://localhost:3001/v1',
      'BACKEND_URL': 'http://localhost:3001/v1',
      'NEXT_PUBLIC_AIRLINE_API_URL': 'http://10.43.103.34:8080/v1',
      'NEXT_PUBLIC_HOTEL_API_URL': 'http://10.43.103.234:8080/manejadordb',
      'NEXT_PUBLIC_BANK_API_URL': 'http://localhost:3000',
      'NODE_ENV': 'development',
      'NEXT_PUBLIC_DEBUG_API': 'true',
      'NEXT_PUBLIC_LOG_API_REQUESTS': 'true'
    }
  },
  prod: {
    file: '.env.production',
    description: 'Production Environment',
    config: {
      'NEXT_PUBLIC_API_URL': 'https://api.turismo.com/v1',
      'BACKEND_URL': 'https://api.turismo.com/v1',
      'NEXT_PUBLIC_AIRLINE_API_URL': 'http://10.43.103.34:8080/v1',
      'NEXT_PUBLIC_HOTEL_API_URL': 'http://10.43.103.234:8080/manejadordb',
      'NEXT_PUBLIC_BANK_API_URL': 'https://banco.production.com',
      'NODE_ENV': 'production',
      'NEXT_PUBLIC_DEBUG_API': 'false',
      'NEXT_PUBLIC_LOG_API_REQUESTS': 'false'
    }
  }
};

function createEnvFile(envType = 'dev') {
  const env = environments[envType];
  
  if (!env) {
    console.error(`❌ Unknown environment: ${envType}`);
    console.log('Available environments:', Object.keys(environments).join(', '));
    process.exit(1);
  }
  
  const envPath = path.join(process.cwd(), env.file);
  
  if (fs.existsSync(envPath)) {
    console.log(`⚠️  File ${env.file} already exists. Backing up...`);
    fs.copyFileSync(envPath, `${envPath}.backup.${Date.now()}`);
  }
  
  let content = `# ${env.description}\n`;
  content += `# Generated on ${new Date().toISOString()}\n\n`;
  
  for (const [key, value] of Object.entries(env.config)) {
    content += `${key}=${value}\n`;
  }
  
  // Add common configuration
  content += `\n# Common Configuration\n`;
  content += `NEXT_PUBLIC_APP_NAME=Turismo App\n`;
  content += `NEXT_PUBLIC_APP_VERSION=1.0.0\n`;
  content += `NEXT_PUBLIC_DEFAULT_CURRENCY=COP\n`;
  content += `NEXT_PUBLIC_FLIGHT_MARGIN=5\n`;
  content += `NEXT_PUBLIC_HOTEL_MARGIN=10\n`;
  content += `NEXT_PUBLIC_ENABLE_HOTEL_BOOKING=true\n`;
  content += `NEXT_PUBLIC_ENABLE_FLIGHT_BOOKING=true\n`;
  content += `NEXT_PUBLIC_ENABLE_PACKAGE_BOOKING=true\n`;
  content += `NEXT_PUBLIC_ENABLE_REPORTING=true\n`;
  content += `NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token\n`;
  content += `NEXT_PUBLIC_SESSION_TIMEOUT=120\n`;
  
  fs.writeFileSync(envPath, content);
  
  console.log(`✅ Created ${env.file} for ${env.description}`);
  console.log(`📝 Edit ${env.file} to customize your configuration`);
  
  if (envType === 'dev') {
    console.log(`\n🚀 You can now start the development server:`);
    console.log(`   npm run dev`);
    console.log(`   # or`);
    console.log(`   yarn dev`);
  }
}

// Main execution
const envType = process.argv[2] || 'dev';

console.log('🔧 Turismo Frontend Environment Setup');
console.log('=====================================\n');

createEnvFile(envType);

console.log('\n📚 Documentation:');
console.log('- See .env.example for all available variables');
console.log('- Check docs/API_SERVICES.md for API usage examples');
console.log('- Backend should be running on localhost:3001');
console.log('\n✨ Environment setup complete!');