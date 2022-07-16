import libs from '/@/tool/lib.esm';

export function renderTableCommas({ text }) {
  return libs.num.numberWithCommas(text);
}

export function cellNumberNegativeRed(colName) {
  return function (record) {
    if (record[colName] < 0) {
      return {
        style: {
          color: '#f22',
        },
      };
    }
  };
}

export const baseUserReportColumns = [
  {
    title: 'Rounds',
    dataIndex: 'count',
    customCell: cellNumberNegativeRed('count'),
    customRender: renderTableCommas,
  },
  {
    title: 'Turnover',
    dataIndex: 'turnover',
    customCell: cellNumberNegativeRed('turnover'),
    customRender: renderTableCommas,
  },
  {
    title: 'Winloss',
    dataIndex: 'winloss',
    customCell: cellNumberNegativeRed('winloss'),
    customRender: renderTableCommas,
  },
  {
    title: 'Rake',
    dataIndex: 'rake',
    customCell: cellNumberNegativeRed('rake'),
    customRender: renderTableCommas,
  },
  {
    title: 'NetWinloss',
    dataIndex: 'netWinloss',
    customCell: cellNumberNegativeRed('netWinloss'),
    customRender: renderTableCommas,
  },
  {
    title: '100% Rake',
    dataIndex: 'totalRake',
    customCell: cellNumberNegativeRed('totalRake'),
    customRender: renderTableCommas,
  },
  {
    title: 'Player Rakeback',
    dataIndex: 'rakeback',
    customCell: cellNumberNegativeRed('rakeback'),
    customRender: renderTableCommas,
  },
];

export const columnRakeWinLoss = [
  {
    title: 'Turnover',
    dataIndex: 'turnover',
    customCell: cellNumberNegativeRed('turnover'),
    customRender: renderTableCommas,
  },
  {
    title: 'Winloss',
    dataIndex: 'winloss',
    customCell: cellNumberNegativeRed('winloss'),
    customRender: renderTableCommas,
  },
  {
    title: 'Rake',
    dataIndex: 'rake',
    customCell: cellNumberNegativeRed('rake'),
    customRender: renderTableCommas,
  },
  {
    title: 'NetWinloss',
    dataIndex: 'netWinloss',
    customCell: cellNumberNegativeRed('netWinloss'),
    customRender: renderTableCommas,
  },
];

export const playerColumnRakeWinLoss = [
  {
    title: 'PlayerID',
    dataIndex: 'playerID',
    customCell: cellNumberNegativeRed('playerID'),
    customRender: renderTableCommas,
  },
  {
    title: 'PlayerAccount',
    dataIndex: 'playerAccount',
    customCell: cellNumberNegativeRed('playerAccount'),
    customRender: renderTableCommas,
  },
  {
    title: 'PlayerNickName',
    dataIndex: 'playerNickName',
    customCell: cellNumberNegativeRed('playerNickName'),
    customRender: renderTableCommas,
  },
  {
    title: 'Rounds',
    dataIndex: 'count',
    customCell: cellNumberNegativeRed('count'),
    customRender: renderTableCommas,
  },
  {
    title: 'Turnover',
    dataIndex: 'turnover',
    customCell: cellNumberNegativeRed('turnover'),
    customRender: renderTableCommas,
  },
  {
    title: 'Winloss',
    dataIndex: 'winloss',
    customCell: cellNumberNegativeRed('winloss'),
    customRender: renderTableCommas,
  },
  {
    title: 'NetWinloss',
    dataIndex: 'netWinloss',
    customCell: cellNumberNegativeRed('netWinloss'),
    customRender: renderTableCommas,
  },
  {
    title: 'Rake',
    dataIndex: 'rake',
    customCell: cellNumberNegativeRed('rake'),
    customRender: renderTableCommas,
  },
];
