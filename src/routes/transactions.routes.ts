import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import ImportCSVTransactionsService from '../services/ImportCSVTransactionsService';

const transactionsRouter = Router();

const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });

  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, type, categoryTitle, value } = request.body;

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    type,
    categoryTitle,
    value,
  });

  return response.json(transaction);
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importCSVTransactions = new ImportCSVTransactionsService();
    const { file } = request;

    const transactions = await importCSVTransactions.execute({
      fileName: file.filename,
    });
    return response.json(transactions);
  },
);

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const transactionsRepository = getCustomRepository(TransactionsRepository);

  await transactionsRepository.delete(id);

  return response.json({ success: 'Transaction deleted with success' });
});

export default transactionsRouter;
