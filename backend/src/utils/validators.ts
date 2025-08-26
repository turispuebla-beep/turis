export const validateNotificationTarget = (target: string): boolean => {
    const validTargets = [
        'all',
        'members',
        'friends',
        'team_members',
        'team_all',
        'category_players',
        'member'
    ];
    return validTargets.includes(target);
};



