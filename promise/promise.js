function noop() {

}
class OwnPromise {
  constructor(executor) {
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

  resolve(data) {
    this.queue.forEach(cb => {
      data = cb(data);
    });
    this.finallyHandler();
  }

  reject(error) {
    this.errorHandler(error);
    this.finallyHandler();
  }

  then(fn) {
    this.queue.push(fn);
    return this;
  }

  catch(fn) {
    this.errorHandler = fn;
    return this;
  }

  finally(fn) {
    this.finallyHandler = fn;
    return this;
  }
}

const promise = new OwnPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Works')
  }, 1500)
})

promise
  .then(course => course.toUpperCase())
  .then(title => console.log('Promise:', title))
  .catch(err => console.log('Error:', err))
  .finally(() => console.log('Finally'))

module.exports = OwnPromise;
