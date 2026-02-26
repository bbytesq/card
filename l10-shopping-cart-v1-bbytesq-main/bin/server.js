import fastify from 'fastify';
import data from '../__fixtures__/response.js';

const server = fastify();

server.get('/products', async (request, reply) => {
  reply
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(JSON.stringify(data.products));
});

server.get('/cart', (request, reply) => {
  reply
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(JSON.stringify(data.cart));
});

server.post('/cart', (request, reply) => {
  const { id } = request.body;
  const item = data.products.find((product) => +product.id === +id);
  const cartItem = data.cart.find((product) => +product.id === +id);
  if (cartItem) {
    cartItem.count += 1;
  } else data.cart.push({ ...item, count: 1 });
  reply.send('ok');
});

server.post('/reset', (req, reply) => {
  data.cart = [];
  reply.send('ok');
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
