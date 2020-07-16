const OwnPromise = require('./promise');

describe('Own Promise', () => {
  const successResult = 'any';
  const errorResult = 'Any error';

  let p;
  let executorSpy;

  beforeEach(() => {
    executorSpy = jest.fn((res) => setTimeout(() => res(successResult), 150));
    p = new OwnPromise(executorSpy);
  })
  test('should exists and to be type of function', () => {
    expect(OwnPromise).toBeDefined();
    expect(typeof OwnPromise).toBe('function');
  });

  test('instance should have then, catch, finally', () => {
    expect(p.then).toBeDefined();
    expect(p.catch).toBeDefined();
    expect(p.finally).toBeDefined();
  })

  test('should call executor function', () => {
    expect(executorSpy).toHaveBeenCalled();
  });

  test('should return data and chain this', async () => {
    const result = await p.then(num => num).then(num => num.toUpperCase());
    expect(result).toBe(successResult.toUpperCase());
  });

  test('should catch error', async () => {
    const errorExecutor = (_, reject) => setTimeout(() => { reject(errorResult) }, 150);
    const errorPromise = new OwnPromise(errorExecutor);

    return new Promise((res) => {
      errorPromise.catch(error => {
        expect(error).toBe(errorResult);
        res();
      });
    })
  });

  test('should call finally', async () => {
    const finallySpy = jest.fn();
    await p.finally(finallySpy);

    expect(finallySpy).toHaveBeenCalled();
  })
});
