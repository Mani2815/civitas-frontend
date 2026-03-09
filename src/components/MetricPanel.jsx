const MetricPanel = ({ children, className = '' }) => {
    return (
        <div className={`panel p-5 ${className}`}>
            {children}
        </div>
    );
};

export default MetricPanel;
