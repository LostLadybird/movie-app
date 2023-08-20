import { Component } from 'react';
import { Tabs } from 'antd';

import './header-tabs.css';

export default class HeaderTabs extends Component {
  onChangeTab = (key) => {
    this.props.onTabChange(key);
  };
  render() {
    const items = [
      {
        key: '1',
        label: 'Search',
      },
      {
        key: '2',
        label: 'Rated',
      },
    ];
    return <Tabs defaultActiveKey="1" items={items} onChange={this.onChangeTab} destroyInactiveTabPane />;
  }
}
