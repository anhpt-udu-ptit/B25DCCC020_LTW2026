export const matchesReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD':
            return [...action.payload];
        case 'ADD': {
            const nextId = state.reduce((max, m) => Math.max(max, m.id), 0) + 1;
            return [...state, { ...action.payload, id: nextId }];
        }
        case 'REMOVE':
            return state.filter((m) => m.id !== action.payload);
        case 'SET_GOALS':
            return state.map((m) =>
                m.id === action.payload.id
                    ? {
                        ...m,
                        homeGoals: action.payload.homeGoals,
                        awayGoals: action.payload.awayGoals,
                    }
                    : m
            );
        default:
            return state;
    }
};