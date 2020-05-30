import fs from 'fs';
import path from 'path';
import csv from 'csv-parse/lib/sync';

import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

interface Request {
  fileName: string;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportCSVTransactionsService {
  public async execute({ fileName }: Request): Promise<Transaction[]> {
    const createTransactions = new CreateTransactionService();

    const filePath = path.join(uploadConfig.directory, fileName);

    const fileCSV = await fs.promises.readFile(filePath);

    const data: TransactionDTO[] = csv(fileCSV.toString(), {
      columns: true,
      skip_empty_lines: true,
    });

    const promises = data.map(async transaction => {
      return await createTransactions.execute({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        categoryTitle: transaction.category,
      });
    });

    const transactions = Promise.all(promises);

    await fs.promises.unlink(filePath);

    return transactions;
  }
}

export default ImportCSVTransactionsService;
