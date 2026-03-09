import Card from './Card';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
    const colors = {
        primary: 'text-primary bg-primary-lighter',
        blue: 'text-info bg-info-light',
        orange: 'text-warning bg-warning-light',
        red: 'text-error bg-error-light',
        purple: 'text-secondary-purple bg-secondary-purple/10',
    };

    return (
        <Card className="flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-text-secondary text-sm font-medium uppercase tracking-wide">{title}</h3>
                <div className={`p-2 rounded-lg ${colors[color] || colors.primary}`}>
                    <Icon size={20} />
                </div>
            </div>

            <div>
                <span className="text-2xl font-bold text-text-primary block">{value}</span>
                {trend && (
                    <div className={`flex items-center text-xs font-medium mt-2 ${trend === 'up' ? 'text-success' : 'text-error'}`}>
                        <span>{trend === 'up' ? '↑' : '↓'} {trendValue}</span>
                        <span className="text-text-tertiary ml-1">vs last month</span>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StatCard;
