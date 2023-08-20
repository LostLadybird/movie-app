import { Offline, Online } from 'react-detect-offline';
import { Alert } from 'antd';

const ErrorIndicator = () => {
  return (
    <div style={{ width: '100%' }}>
      <Online>
        <Alert
          message="BOOM!"
          description="Oops! Something has gone terribly wrong (but we are already trying to fix it)"
          type="error"
          showIcon
        />
      </Online>
      <Offline>
        <Alert
          message="BOOM!"
          description="You have got some problems with the internet connection!"
          type="error"
          showIcon
        />
      </Offline>
    </div>
  );
};

export default ErrorIndicator;
