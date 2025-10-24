import nodemailer from 'nodemailer'
import logger from './logger'
import { TradingSweepResult } from './trading-api-client'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const SMTP_FROM = process.env.SMTP_FROM || 'noreply@zixly.com.au'
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'cole.morton@hotmail.com'

export class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        },
      })

      logger.info('Email service configured', {
        host: SMTP_HOST,
        port: SMTP_PORT,
      })
    } else {
      logger.warn('Email service not configured (missing SMTP credentials)')
    }
  }

  async sendSuccessNotification(
    jobId: string,
    ticker: string,
    sweepRunId: string,
    bestResults: TradingSweepResult[],
    executionTimeSeconds: number
  ): Promise<void> {
    if (!this.transporter) {
      logger.warn('Email not sent (transporter not configured)')
      return
    }

    try {
      const bestResult = bestResults[0]

      const subject = `✅ Trading Sweep Complete - ${ticker} - Best Result`
      const body = `
✅ SWEEP COMPLETED - ${ticker}

🏆 BEST RESULT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ticker: ${bestResult.ticker}
Strategy: ${bestResult.strategy_type}
Parameters: ${bestResult.fast_period}/${bestResult.slow_period}

📊 Performance Metrics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score: ${bestResult.score.toFixed(2)}
Sharpe Ratio: ${bestResult.sharpe_ratio.toFixed(2)}
Sortino Ratio: ${bestResult.sortino_ratio.toFixed(2)}
Total Return: ${bestResult.total_return_pct.toFixed(2)}%
Annualized Return: ${bestResult.annualized_return.toFixed(2)}%

📈 Risk Metrics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Max Drawdown: ${bestResult.max_drawdown_pct.toFixed(2)}%
Win Rate: ${bestResult.win_rate_pct.toFixed(2)}%
Profit Factor: ${bestResult.profit_factor.toFixed(2)}

📋 Trading Stats:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Trades: ${bestResult.total_trades}
Trades/Month: ${bestResult.trades_per_month.toFixed(1)}
Avg Duration: ${bestResult.avg_trade_duration}

🔗 Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sweep Run ID: ${sweepRunId}
Job ID: ${jobId}
Execution Time: ${executionTimeSeconds}s
Results Count: ${bestResults.length}

Generated: ${new Date().toISOString()}
      `.trim()

      await this.transporter.sendMail({
        from: SMTP_FROM,
        to: NOTIFICATION_EMAIL,
        subject,
        text: body,
      })

      logger.info('Success notification sent', {
        job_id: jobId,
        ticker,
      })
    } catch (error) {
      logger.error('Failed to send success notification', {
        error,
        job_id: jobId,
      })
    }
  }

  async sendFailureNotification(
    jobId: string,
    ticker: string,
    errorMessage: string
  ): Promise<void> {
    if (!this.transporter) {
      logger.warn('Email not sent (transporter not configured)')
      return
    }

    try {
      const subject = `❌ Trading Sweep Failed - ${ticker}`
      const body = `
❌ SWEEP FAILED - ${ticker}

⚠️ Error Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Error: ${errorMessage}

📋 Job Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Job ID: ${jobId}
Ticker: ${ticker}
Failed: ${new Date().toISOString()}

💡 Next Steps:
- Check Trading API logs for details
- Verify parameters are correct
- Try with different ticker or smaller range

Generated: ${new Date().toISOString()}
      `.trim()

      await this.transporter.sendMail({
        from: SMTP_FROM,
        to: NOTIFICATION_EMAIL,
        subject,
        text: body,
      })

      logger.info('Failure notification sent', {
        job_id: jobId,
        ticker,
      })
    } catch (error) {
      logger.error('Failed to send failure notification', {
        error,
        job_id: jobId,
      })
    }
  }
}

const emailService = new EmailService()
export default emailService
