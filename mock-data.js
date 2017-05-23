export default {
  byId: {
    1: {
      id: '1',
      name: 'One',
      lazyLoad: true,
    },
    2: {
      id: '2',
      name: 'Two',
      childIds: ['2.1', '2.2'],
    },
    4: {
      id: '4',
      name: 'four',
      childIds: [],
    },
    2.1: {
      id: '2.1',
      name: 'Two.One',
    },
    2.2: {
      id: '2.2',
      name: 'Two.Two',
      childIds: ['2.2.1', '2.2.2'],
    },
    '2.2.1': {
      id: '2.2.1',
      name: 'Two.Two.one',
    },
    '2.2.2': {
      id: '2.2.2',
      name: 'Two.Two.two',
      lazyLoad: true,
    },
    3: {
      id: '3',
      name: 'three',
    },
    5: {
      id: '5',
      name: 'Five',
      lazyLoad: true,
    },
  },
  rootIds: ['1', '2', '3', '4', '5'],
};
