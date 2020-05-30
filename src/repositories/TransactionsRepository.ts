import { Repository, EntityRepository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeTransactions = await this.find({ where: { type: 'income' } });

    const incomeTotal = incomeTransactions.reduce((acc, nxt) => {
      return acc + Number(nxt.value);
    }, 0);

    const outcomeTransactions = await this.find({
      where: { type: 'outcome' },
    });

    const outcomeTotal = outcomeTransactions.reduce((acc, nxt) => {
      return acc + Number(nxt.value);
    }, 0);

    const total = incomeTotal - outcomeTotal;

    return {
      income: incomeTotal.toFixed(2),
      outcome: outcomeTotal.toFixed(2),
      total: total.toFixed(2),
    };
  }
}

export default TransactionsRepository;
