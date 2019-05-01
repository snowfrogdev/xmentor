import { unskipDescribes, unskipTests } from '../src/commands/xmentor'

test('unskipDescribes', async () => {
const describeFileContent = `
describe.only('my beverage', () => {
    test('is delicious', () => {
        expect(myBeverage.delicious).toBeTruthy();
    });

    test('is not sour', () => {
        expect(myBeverage.sour).toBeFalsy();
    });
});

fdescribe('my beverage', () => {
    test('is delicious', () => {
        expect(myBeverage.delicious).toBeTruthy();
    });

    test('is not sour', () => {
        expect(myBeverage.sour).toBeFalsy();
    });
});

describe.only.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    test('returns expected', () => {
      expect(a + b).toBe(expected);
    });
  },
);

fdescribe.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    test('returns expected', () => {
      expect(a + b).toBe(expected);
    });
  },
);

describe.skip('my other beverage', () => {
  // ... will be skipped
});

xdescribe('my other beverage', () => {
  // ... will be skipped
});

describe.skip.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    test('returns expected', () => {
      expect(a + b).toBe(expected); // will not be ran
    });
  },
);

xdescribe.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    test('returns expected', () => {
      expect(a + b).toBe(expected); // will not be ran
    });
  },
);
`

const expected = `
describe('my beverage', () => {
    test('is delicious', () => {
        expect(myBeverage.delicious).toBeTruthy();
    });

    test('is not sour', () => {
        expect(myBeverage.sour).toBeFalsy();
    });
});

describe('my beverage', () => {
    test('is delicious', () => {
        expect(myBeverage.delicious).toBeTruthy();
    });

    test('is not sour', () => {
        expect(myBeverage.sour).toBeFalsy();
    });
});

describe.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    test('returns expected', () => {
      expect(a + b).toBe(expected);
    });
  },
);

describe.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    test('returns expected', () => {
      expect(a + b).toBe(expected);
    });
  },
);

describe('my other beverage', () => {
  // ... will be skipped
});

describe('my other beverage', () => {
  // ... will be skipped
});

describe.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    test('returns expected', () => {
      expect(a + b).toBe(expected); // will not be ran
    });
  },
);

describe.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    test('returns expected', () => {
      expect(a + b).toBe(expected); // will not be ran
    });
  },
);
`
    const result = unskipDescribes(describeFileContent)
    expect(result).toBe(expected)
})

test('unskipTests', async () => {
  const testFileContent = `
test.only('it is raining', () => {
  expect(inchesOfRain()).toBeGreaterThan(0);
});

ftest('it is raining', () => {
  expect(inchesOfRain()).toBeGreaterThan(0);
});

it.only('it is raining', () => {
  expect(inchesOfRain()).toBeGreaterThan(0);
});

fit('it is raining', () => {
  expect(inchesOfRain()).toBeGreaterThan(0);
});

test.only.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected);
  },
);

ftest.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected);
  },
);

it.only.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected);
  },
);

fit.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected);
  },
);

test.skip('it is not snowing', () => {
  expect(inchesOfSnow()).toBe(0);
});

xtest('it is not snowing', () => {
  expect(inchesOfSnow()).toBe(0);
});

it.skip('it is not snowing', () => {
  expect(inchesOfSnow()).toBe(0);
});

xit('it is not snowing', () => {
  expect(inchesOfSnow()).toBe(0);
});

test.skip.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected); // will not be ran
  },
);

it.skip.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected); // will not be ran
  },
);

xtest.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected); // will not be ran
  },
);

it.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected); // will not be ran
  },
);
`
  const expected = `
test('it is raining', () => {
  expect(inchesOfRain()).toBeGreaterThan(0);
});

test('it is raining', () => {
  expect(inchesOfRain()).toBeGreaterThan(0);
});

test('it is raining', () => {
  expect(inchesOfRain()).toBeGreaterThan(0);
});

test('it is raining', () => {
  expect(inchesOfRain()).toBeGreaterThan(0);
});

test.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected);
  },
);

test.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected);
  },
);

test.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected);
  },
);

test.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected);
  },
);

test('it is not snowing', () => {
  expect(inchesOfSnow()).toBe(0);
});

test('it is not snowing', () => {
  expect(inchesOfSnow()).toBe(0);
});

test('it is not snowing', () => {
  expect(inchesOfSnow()).toBe(0);
});

test('it is not snowing', () => {
  expect(inchesOfSnow()).toBe(0);
});

test.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected); // will not be ran
  },
);

test.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected); // will not be ran
  },
);

test.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected); // will not be ran
  },
);

it.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected); // will not be ran
  },
);
`

expect(unskipTests(testFileContent)).toBe(expected)
})



