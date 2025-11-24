// File: examples/getServerSideProps-quote.ts
// Example using `getServerSideProps` (pages router) to call /checkout/quote with HttpOnly cookie
import type { GetServerSideProps } from 'next';
import { apiClient } from '../lib/api/client';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.req.cookies['session_token'];
  const clientId = ctx.query.clientId as string | undefined;
  if (!clientId) return { notFound: true };

  try {
    const quote = await apiClient('/checkout/quote', {
      method: 'POST',
      body: { clientId },
      authToken: token,
    });
    return { props: { quote } };
  } catch (e) {
    return { props: { quote: null } };
  }
};

export default function Page() {
  return null;
}
