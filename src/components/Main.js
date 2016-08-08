require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('../data/imageDatas.json');

// 构建图片路径(执行一次所以用自执行函数)
imageDatas = (function(aImageDatas) {
  for (var i = 0, j = aImageDatas.length; i < j; i++) {
    var oImg = aImageDatas[i];
    oImg.imageURL = require('../images/' + oImg.fileName);
    aImageDatas[i] = oImg;
  }
  return aImageDatas;
}(imageDatas));

/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

/*
 * 获取 0～30 之间的一个任意正负值
 */
function get30DegRandom() {
  return (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 30)
}

class ImgFigure extends React.Component {

  /*
   * imgFigure的点击处理函数
   */
  handleClick(e) {

    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }

  render() {

    var oStyle = {};

    // 如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      oStyle = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值且不为0，添加旋转角度
    if (this.props.arrange.rotate) {
      (['-moz-', '-ms-', '-webkit-', '']).forEach(function(value) {
        oStyle[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    if (this.props.arrange.isCenter) {
      oStyle.zIndex = 11;
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={oStyle} onClick={this.handleClick.bind(this)}>
          <img src={this.props.data.imageURL}
               alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back" onClick={this.handleClick.bind(this)}>
              <p>
                {this.props.data.desc}
              </p>
            </div>
          </figcaption>
      </figure>
    );
  }
}


class AppComponent extends React.Component {
  /*
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @return {Function} 这是一个闭包函数，其内return 一个真正待执行的函数
   */
  inverse(index) {
    return function() {
      var aImgsArrange = this.state.aImgsArrange;

      aImgsArrange[index].isInverse = !aImgsArrange[index].isInverse;

      this.setState({
        aImgsArrange: aImgsArrange
      });


    }.bind(this);
  }

  /*
   * 重新布局所有的图片
   * @param centerIndex 指定居中排布哪个图片
   */
  rearrange(centerIndex) {

    var aImgsArrange = this.state.aImgsArrange,
      Constant = this.state.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      aImgsArrangeTop = [],
      nTopImg = Math.floor(Math.random() * 2), //取1个或者不取
      nTopImgSplliceIndex = 0,
      aImgsArrangeCenter = aImgsArrange.splice(centerIndex, 1);

      // 首先居中 centerindex 的图片，居中 centerIndex 的图片不需要旋转
      aImgsArrangeCenter[0] = {
        pos: centerPos,
        rotate: 0,
        isCenter: true
      };

      // 取出要布局上侧的图片的状态信息
      nTopImgSplliceIndex = Math.floor(Math.random() * aImgsArrange.length - nTopImg)
      aImgsArrangeTop = aImgsArrange.splice(nTopImgSplliceIndex, nTopImg);

      // 布局位于上侧的图片
      aImgsArrangeTop.forEach(function(value, index) {
        aImgsArrangeTop[index] = {
          pos: {
            top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
            left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          },
          rotate: get30DegRandom(),
          isCenter: false
        }
      });

      // 布局左右两侧的图片
      for (var i = 0, j = aImgsArrange.length, k = j / 2; i < j; i++) {
        var hPosRangeLORX = null;
        // 前半部分布局左边，后半部分布局右边
        if (i < k) {
          hPosRangeLORX = hPosRangeLeftSecX;
        } else {
          hPosRangeLORX = hPosRangeRightSecX;
        }

        aImgsArrange[i] = {
          pos: {
            top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
            left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          },
          rotate: get30DegRandom(),
          isCenter: false
        }
      }

      // 塞回插入上面的图片位置信息
      if (aImgsArrangeTop && aImgsArrangeTop[0]) {
        aImgsArrange.splice(nTopImgSplliceIndex, 0, aImgsArrangeTop[0]);
      }
      // 塞回中心位置的图片信息
      aImgsArrange.splice(centerIndex, 0, aImgsArrangeCenter[0]);
      this.setState(this.state.Constant)
  }

  /*
   * 利用 rearrange 函数，居中对应index的图片
   * @param index, 需要被居中的图片对应的图片信息数组的index值
   * @return {Function}
   */
  center(index) {
    return function() {
      this.rearrange(index);
    }.bind(this);
  }

  constructor(props) {
    super(props);
    this.state = {
      aImgsArrange: [
        // {
        //   pos: {
        //     left: '0',
        //     top: '0'
        //   },
        //   rotate: '0'      // 旋转角度
        //   isInverse: false // 图片正反面
        //   isCenter: false  // 图片是否居中
        // }
      ],
      Constant: {
        centerPos: {
          left: 0,
          right: 0
        },
        hPosRange: {//水平方向取值范围
          leftSecX: [0, 0],
          rightSecX: [0, 0],
          y: [0, 0]
        },
        vPosRange: {//垂直方向的取值范围
          x: [0, 0],
          topY: [0, 0]
        }
      }
    };
  }

  // 组件加载以后，为每张图片计算其舞台位置
  componentDidMount() {
    // 舞台的大小
    // sW: 实际内容宽度，不包含滚动条 边界
    // cW: 内容可视区宽度 不包含
    // oW: 包含滚动条 实际大小
    var stageDom = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDom.scrollWidth,
      stageH = stageDom.scrollHeight,
      halfStageW = Math.floor(stageW / 2),
      halfStageH = Math.floor(stageH / 2);

    // 拿到一个imageFigure的大小
    var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDom.scrollWidth,
      imgH = imgFigureDom.scrollHeight,
      halfImgW = Math.floor(imgW / 2),
      halfImgH = Math.floor(imgH / 2);


    // 计算中心图片的位置点
    this.state.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左侧 右侧区域图片排布位置的取值范围
    this.state.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.state.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.state.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.state.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.state.Constant.hPosRange.y[0] = -halfImgH;
    this.state.Constant.hPosRange.y[1] = stageH - halfImgH;
    // 计算上侧区域图片排布位置的取值范围
    this.state.Constant.vPosRange.topY[0] = -halfImgH;
    this.state.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.state.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.state.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render() {
    var aControllerUnits = [],
      aFigures = [];

    imageDatas.forEach(function(value, index) {
      // 如果当前没有状态对象 则初始化
      if (!this.state.aImgsArrange[index]) {
        this.state.aImgsArrange[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      aFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.aImgsArrange[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {aFigures}
        </section>
        <nav className="controller-nav">
          {aControllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
