import { afterAll, afterEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { ApiProductRepository } from '../../src/data/repositories/ApiProductRepository';

const server = setupServer(
  http.get('/api/products', () => HttpResponse.json([{ id: '1', name: 'Mouse', price: 25 }]))
);

afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('ApiProductRepository integration', () => {
  it('maps API DTO to domain entities', async () => {
    server.listen({ onUnhandledRequest: 'error' });
    const repository = new ApiProductRepository();

    const products = await repository.getAll();

    expect(products[0]?.name).toBe('Mouse');
    expect(products[0]?.price).toBe(25);
  });
});
