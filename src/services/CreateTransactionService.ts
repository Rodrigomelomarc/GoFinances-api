import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  categoryTitle: string;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    categoryTitle,
    type,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Invalid transaction type');
    }

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > Number(balance.total)) {
      throw new AppError('Insufficient balance');
    }

    const category = await categoriesRepository.findOrCreate(categoryTitle);

    const transaction = transactionsRepository.create({
      title,
      value,
      category_id: category.id,
      type,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
