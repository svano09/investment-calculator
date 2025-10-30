class Logger {
  static log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...data
    };

    console.log(JSON.stringify(logEntry));
  }

  static info(message, data) {
    this.log('INFO', message, data);
  }

  static warn(message, data) {
    this.log('WARN', message, data);
  }

  static error(message, data) {
    this.log('ERROR', message, data);
  }

  static debug(message, data) {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, data);
    }
  }
}

module.exports = Logger;