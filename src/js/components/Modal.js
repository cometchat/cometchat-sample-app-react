import React from 'react';
import ReactDOM from 'react-dom';


const modalRoot = document.getElementById('cometchat');

export default class Modal extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node
  }

  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}