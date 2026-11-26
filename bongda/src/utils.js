import { MAX_GOALS, POINTS, TEAMS } from './data';

export const getTeamName = (id) => {
  const team = TEAMS.find((t) => t.id === Number(id));
  return team ? team.name : '';
};

export const getResult = (match) => {
  if (match.homeGoals > match.awayGoals) return 'home';
  if (match.homeGoals < match.awayGoals) return 'away';
  return 'draw';
};

export const isValidGoals = (n) =>
  typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;

export const calcStandings = (matches) => {
  const table = TEAMS.map((team) => ({
    id: team.id,
    name: team.name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    diff: 0,
    points: 0,
  }));

  const map = new Map(table.map((row) => [row.id, row]));

  matches.forEach((m) => {
    const home = map.get(m.home);
    const away = map.get(m.away);
    if (!home || !away) return;

    home.played += 1;
    away.played += 1;
    home.gf += m.homeGoals;
    home.ga += m.awayGoals;
    away.gf += m.awayGoals;
    away.ga += m.homeGoals;

    const result = getResult(m);
    if (result === 'home') {
      home.won += 1;
      home.points += POINTS.win;
      away.lost += 1;
      away.points += POINTS.loss;
    } else if (result === 'away') {
      home.lost += 1;
      home.points += POINTS.loss;
      away.won += 1;
      away.points += POINTS.win;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += POINTS.draw;
      away.points += POINTS.draw;
    }
  });

  const result = table.map((row) => ({ ...row, diff: row.gf - row.ga }));

  return [...result].sort(
    (a, b) =>
      b.points - a.points ||
      b.diff - a.diff ||
      b.gf - a.gf ||
      a.name.localeCompare(b.name, 'vi')
  );
};

export const calcMatchStats = (matches) => {
  const counts = { home: 0, draw: 0, away: 0 };
  let goals = 0;

  matches.forEach((m) => {
    goals += m.homeGoals + m.awayGoals;
    counts[getResult(m)] += 1;
  });

  const count = matches.length;
  const average = count === 0 ? 0 : Math.round((goals / count) * 100) / 100;

  return { count, goals, average, counts };
};

export const calcNeeded = (standings, teamId, target, remaining) => {
  const team = standings.find((row) => row.id === Number(teamId));
  const targetStr = String(target).trim();
  const remainingStr = String(remaining).trim();
  const targetNum = Number(targetStr);
  const remainingNum = Number(remainingStr);

  if (
    !team ||
    targetStr === '' ||
    remainingStr === '' ||
    !Number.isInteger(targetNum) ||
    targetNum < 0 ||
    !Number.isInteger(remainingNum) ||
    remainingNum < 1
  ) {
    return 'Hãy chọn đội, nhập số điểm mục tiêu (từ 0) và số trận còn lại (từ 1)';
  }

  const need = targetNum - team.points;
  if (need <= 0) {
    return 'Đội đã đạt mục tiêu';
  }
  if (need > 3 * remainingNum) {
    return 'Không thể đạt mục tiêu này';
  }

  const wins = Math.max(0, Math.ceil((need - remainingNum) / 2));
  return `Cần thêm ${need} điểm ở ${remainingNum} trận còn lại, tối thiểu ${wins} trận thắng`;
};
