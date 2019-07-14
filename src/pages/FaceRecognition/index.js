import React, { Component } from 'react';
import * as faceapi from 'face-api.js';
import { Select, Row, Col, Input, Button, Alert } from 'antd';
import styles from './style.less';
import { async } from 'q';

class FaceRecognition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referenceImageSrc: '/images/Melania1.jpg',
      inputImageSrc: '/images/Trump1.jpg',
      threshold: 0.6,
      referenceDescription: null, 
      inputDescription: null,
    };
  }

  componentDidMount(){
    this.mounting();
  }

  mounting = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
  }

  referenceImage = () => {
    let temp = window.location.origin + this.state.referenceImageSrc;
    return (
      <img id="face1" src={ temp } />
    )
  }

  inputImage = () => {
    let temp = window.location.origin + this.state.inputImageSrc;
    return (
      <img id="face2" src={ temp } />
    )
  }

  handleReferenceImageSrcChange = async value => {
    const url = `/images/${value}.jpg`;
    const referenceImage = await faceapi.fetchImage(url)
    const referenceDescription = await faceapi.computeFaceDescriptor(referenceImage);
    
    this.setState({ referenceDescription: referenceDescription,
                    referenceImageSrc: url});

    if (!this.state.inputDescription){
      const inputImage = await faceapi.fetchImage(this.state.inputImageSrc);
      const inputDescription = await faceapi.computeFaceDescriptor(inputImage);
      this.setState({ inputDescription: inputDescription});
    }
  }

  handleInputImageSrcImageSrcChange = async value => {
    const url = `/images/${value}.jpg`;
    const inputImage = await faceapi.fetchImage(url)
    const inputDescription = await faceapi.computeFaceDescriptor(inputImage);

    this.setState({ inputDescription: inputDescription,
                    inputImageSrc: url});
    
    if (!this.state.referenceDescription){
      const referenceImage = await faceapi.fetchImage(this.state.referenceImageSrc);
      const referenceDescription = await faceapi.computeFaceDescriptor(referenceImage);
      this.setState({ referenceDescription: referenceDescription});
    }    
  }
   
  handleReferenceUrlPressEnter = async () => {
    const url = event.target.value;
    const image = document.getElementById("face1");
    image.src = url;  

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const res = await fetch(proxyUrl+url);
    const blob = await res.blob();
    const referenceImage = await faceapi.bufferToImage(blob);
    const referenceDescription = await faceapi.computeFaceDescriptor(referenceImage);
    this.setState({ referenceDescription: referenceDescription }); 
    
    if (!this.state.inputDescription){
      const inputImage = await faceapi.fetchImage(this.state.inputImageSrc);
      const inputDescription = await faceapi.computeFaceDescriptor(inputImage);
      this.setState({ inputDescription: inputDescription});
    }
  }
  
  handleInputUrlPressEnter = async () => {
    let url = event.target.value;
    let image = document.getElementById("face2");
    image.src = url;  

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const res = await fetch(proxyUrl+url);
    const blob = await res.blob();
    const inputImage = await faceapi.bufferToImage(blob);
    const inputDescription = await faceapi.computeFaceDescriptor(inputImage);
    this.setState({ inputDescription: inputDescription });

    if (!this.state.referenceDescription){
      const referenceImage = await faceapi.fetchImage(this.state.referenceImageSrc);
      const referenceDescription = await faceapi.computeFaceDescriptor(referenceImage);
      this.setState({ referenceDescription: referenceDescription});
    }
  }
  
  match = ()=> {
    let text;
    
    console.log(this.state);

    if (this.state.referenceDescription&&this.state.inputDescription){
      const distance = faceapi.round(
        faceapi.euclideanDistance(this.state.referenceDescription, this.state.inputDescription)
      );      
      console.log(distance);
      if (distance > this.state.threshold) {
        text = ' Not Match :-(';      
      } else {
        text = ' Match :-)'; 
      }
    } else {
      text = ' Not Match :-(';
    }
    return text;
  }

  render() {
    const { Option } = Select;

    return (
      <div>
        <h1>Face Recognition</h1>
        <div>
          <div>
            <Row>
              <Col span={12}>
                {this.referenceImage()}
              </Col>
              <Col span={12}>
                {this.inputImage()}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Alert  size='large' 
                        style={{ width: 300 }} 
                        message="Please select image from the select list" 
                        type="info" 
                        showIcon 
                />
              </Col>
              <Col span={12}>
                <Alert  size='large' 
                        style={{ width: 300 }} 
                        message="Please select image from the select list" 
                        type="info" 
                        showIcon 
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Select defaultValue="Melania1" 
                        size='large' style={{ width: 300 }} 
                        onChange={this.handleReferenceImageSrcChange}
                >
                  <Option value="Melania1">Melania1</Option>
                  <Option value="Melania2">Melania2</Option>
                  <Option value="Melania3">Melania3</Option>
                  <Option value="Melania4">Melania4</Option>
                  <Option value="Trump1">Trump1</Option>
                  <Option value="Trump2">Trump2</Option>
                  <Option value="Trump3">Trump3</Option>
                  <Option value="Trump4">Trump4</Option>
                </Select>
              </Col>
              <Col span={12}>
                <Select defaultValue="Trump1" 
                        size='large' style={{ width: 300 }} 
                        onChange={this.handleInputImageSrcImageSrcChange}
                >
                  <Option value="Melania1">Melania1</Option>
                  <Option value="Melania2">Melania2</Option>
                  <Option value="Melania3">Melania3</Option>
                  <Option value="Melania4">Melania4</Option>
                  <Option value="Trump1">Trump1</Option>
                  <Option value="Trump2">Trump2</Option>
                  <Option value="Trump3">Trump3</Option>
                  <Option value="Trump4">Trump4</Option>
                </Select>
              </Col>
            </Row>  
            <Row>
              <Col span={12}>
                <Input  size="large" 
                        style={{ width: 300 }} 
                        placeholder="Or please enter .jpg image url and press Enter to upload"
                        onPressEnter ={this.handleReferenceUrlPressEnter}
                />
              </Col>
              <Col span={12}> 
                <Input  size="large" 
                        style={{ width: 300 }} 
                        placeholder="Or please enter .jpg image url and press Enter to upload"
                        onPressEnter ={this.handleInputUrlPressEnter}
                />
              </Col>
            </Row>     
          </div>
          <div>
            <h1>{this.match()}</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default FaceRecognition;
