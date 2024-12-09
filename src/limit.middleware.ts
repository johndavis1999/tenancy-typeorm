import { Injectable, NestMiddleware } from '@nestjs/common';
import { MAX_TENANT_DATA_SOURCES } from './orm.config';
import { NextFunction, Response } from 'express';

@Injectable()
export class LimitMiddleware implements NestMiddleware {
  private activeTasks = 0;
  private queue: (() => void)[] = [];

  private async processQueue(): Promise<void> {
    if (this.activeTasks >= MAX_TENANT_DATA_SOURCES) {
      return;
    }

    const nextTask = this.queue.shift();
    if (nextTask) {
      this.activeTasks++;
      nextTask();
    }
  }

  public async use(_: Request, res: Response, next: NextFunction): Promise<void> {
    const executeTask = () => {
      new Promise<void>((resolve) => {
        res.on('finish', () => {
          this.activeTasks--;
          resolve();
          this.processQueue(); // Procesar la cola al finalizar.
        });
        next();
      });
    };

    this.queue.push(executeTask);
    await this.processQueue();
  }
}
