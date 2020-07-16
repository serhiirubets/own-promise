function noop(): void {}

type ResolveFnType = (data: any) => void;
type ErrorFnType = (err: any) => void;
type FinallyFnType = () => void;

type ExecutorFnType = (res: ResolveFnType, rej: ErrorFnType) => void;

class OwnPromise {
  private queue: Array<ResolveFnType>
  private errorHandler: ErrorFnType
  private finallyHandler: FinallyFnType

  constructor(executor: ExecutorFnType) {
    this.queue = [];
    this.errorHandler = noop;
    this.finallyHandler = noop;

    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.errorHandler(e);
    } finally {
      this.finallyHandler();
    }
  }

  resolve(data): void {
    this.queue.forEach((cb: ResolveFnType) => {
      data = cb(data);
    });
    this.finallyHandler();
  }

  reject(error): void {
    this.errorHandler(error);
    this.finallyHandler();
  }

  then(fn: ResolveFnType): OwnPromise {
    this.queue.push(fn);
    return this;
  }

  catch(fn: ErrorFnType): OwnPromise {
    this.errorHandler = fn;
    return this;
  }

  finally(fn: FinallyFnType): OwnPromise {
    this.finallyHandler = fn;
    return this;
  }
}

const promise = new OwnPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Works')
    // reject('Error')
  }, 1500)
})

promise
  .then(course => course.toUpperCase())
  .then(title => console.log('Promise:', title))
  .catch(err => console.log('Error:', err))
  .finally(() => console.log('Finally'))

module.exports = OwnPromise;
