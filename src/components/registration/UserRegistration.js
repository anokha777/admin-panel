import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Select, Row, Col, Button, Divider, Upload, Spin, message, notification } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined } from '@ant-design/icons';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
import { backendHost } from '../../constant/constants';
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    // box change fix 16
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};


const UserRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageDocUrlId, setProfileImageDocUrlId] = useState(null);
  const [docOrIdCardUrlId, setDocOrIdCardUrlId] = useState(null);
  
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'avatar',
      status: 'done',
      url: 'https://storage.googleapis.com/avyajadocs/media/app-logo.png?GoogleAccessId=avyaja-upload-docs@vizib-php.iam.gserviceaccount.com&Expires=10272869169&Signature=3hbWbF2%2B5Cy7Hn6m9NzA%2B6ETsxmUrUtK7fW8mo662N1XaDIQDhgJUUW%2FdgCHvqAJUczfQ5dL0ImSZ%2F9lnPVRxXfmkVH8MJhxpOFOBhAloV5PGoJDdpPd5PkZeEx%2Bp%2FB8xFgOy4dZ7Ko2y9lqGBkz8lwFzKFEVmlPHFO4MK8eWflq5vdYR2wI4dwXtlHorUMPTM1PBQo1dGfiqDHIPjIgNwKHG8broeQQ1%2FCn%2FYi4BUqHRLoELvX3ga7edgmXPbjYV%2FmjbY56wWOHsYIMaZD9nYFL0gM5GD0bk2HBW1e0I%2FJN9xrdaaKfPxrUuUvQKmogb2R9Zwe%2BkI6BiTdDPVewKA%3D%3D',
    },
  ]);

  // const getHeader = () => {
  //   let config = {
  //     headers: {
  //       // "Cache-Control": "no-cache",
  //       "Content-Type": "application/json",
  //       // "Access-Control-Allow-Origin": "*",
  //     },
  //   };
  //   return config;
  // };
  
  // const backToHome = () => {
  //   window.location.href = "https://avyaja.org";
  // }

  const registerUser = (values) => {
    console.log('values--------', values);
    const uploadedDocs = [
      {
          docOrIdCardTypeId: values.docOrIdCardTypeId === undefined ? null : values.docOrIdCardTypeId,
          docOrIdCardNumber: values.docOrIdCardNumber === undefined ? null : values.docOrIdCardNumber,
          docOrIdCardUrlId: docOrIdCardUrlId,
      }
    ];

    const referrals = [
      {
        referralName: values.referralFullName1  === undefined ? null : values.referralFullName1,
        referralPhoneNo: values.referralPhone1 === undefined ? null : values.referralPhone1,
        referralEmail: values.referralEmail1 === undefined ? null : values.referralEmail1,
        referralAddress: values.referralAddress1 === undefined ? null : values.referralAddress1
      },
      {
        referralName: values.referralFullName2 === undefined ? null : values.referralFullName2,
        referralPhoneNo: values.referralPhone2 === undefined ? null : values.referralPhone2,
        referralEmail: values.referralEmail2 === undefined ? null : values.referralEmail2,
        referralAddress: values.referralAddress2 === undefined ? null : values.referralAddress2
      }
    ];

    values.profileImageDocUrlId = profileImageDocUrlId;
    values.uploadedDocs = uploadedDocs;
    values.referrals = referrals;

    console.log('values', values);

    setIsLoading(true);
    const data = values;
    console.log(data);
    axios.post(`${backendHost}/usermgt/api/register`, data)
    .then((response) => {
      // console.log('res------', response);
      if(response && response.data && response.data.success === true){
        form.resetFields();
        notification.success({
          message: 'Thank you! Registerd successfully.',
          description: (response && response.data && response.data.message) || 'A mail has been sent to you.'
        });
      } else {
        notification.error({
          message: 'Sorry! Registration Failed.',
          description: (response && response.data && response.data.message) || 'There is error while registration, please try after sometime.'
        });
      }
      setIsLoading(false);
      
    }).catch((err) => {
      notification.error({
        message: 'Sorry! Registration Failed.',
        description: 'There is error while registration, please try after sometime.'
      });
      setIsLoading(false);
      // form.resetFields();
    });
  };

  const onChangeProfileImage = ({ fileList: newFileList }) => {
    if (newFileList.length > 0 && newFileList[0].hasOwnProperty('response')) {
      // console.log(newFileList[0].response);
      setProfileImageDocUrlId(newFileList[0].response.id);
      message.success(`${newFileList[0].originFileObj.name} file uploaded successfully`);
      
    }
    setFileList(newFileList);
  };

  const onChangeDocumentUpload = (info) => {

    if (info.file.status !== 'uploading') {
      // console.log('file----------', info.file.response.id);
      // console.log('fileList--------', info.fileList);
    }
    if (info.file.status === 'done') {
      setDocOrIdCardUrlId(info.file.response.id);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const [form] = Form.useForm();

  const onFinish = (values) => {
    // console.log('Received values of form: ', values);
    registerUser(values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+91</Option>
        <Option value="87">+1</Option>
      </Select>
    </Form.Item>
  );

  // const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  return (
    <>
    <Layout>
      <Header>Avyaja Registration Form</Header>
      <Spin spinning={isLoading}>
      <Layout>
        <Content>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
          layout="vertical"
          className="form-layout"
        >
          
            <Row gutter={24}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  name="role"
                  label="What role suits you?"
                  rules={[
                    {
                      required: true,
                      message: 'Please select your role!',
                    },
                  ]}
                >
                  <Select placeholder="Select your role">
                    <Option value="ROLE_SEEKER">Assist Seeker- Senior Citizen</Option>
                    <Option value="ROLE_PRO">Assist Pro- Helping hand for Seniors</Option>
                    <Option value="ROLE_REFER">Assist Refer- can book Assist Services for multiple Elders </Option>
                    <Option value="ROLE_SUPPORTER">Assist Supporter- Delivering services to Seniors</Option>
                    <Option value="ROLE_DONOR">Assist Donor- Seniors Life Assistance as products</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  // noStyle
                  rules={[
                    {
                      required: true,
                      message: 'Please input the full name!',
                    },
                  ]}
                >
                  <Input placeholder="Please enter your full neme included first name and last name" />
                </Form.Item>
              </Col>
              
            </Row>

            <Row gutter={24}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
                <Form.Item
                  name="nickName"
                  label="Nickname"
                  tooltip="What do you want others to call you?"
                  rules={[
                    {
                      required: false,
                      message: 'Please input your nickname!',
                      whitespace: true,
                    },
                  ]}
                >
                <Input placeholder="Your nickname please, if any." />
              </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                  name="username"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your phone number!',
                    },
                  ]}
                >
                  <Input
                    addonBefore={prefixSelector}
                    style={{
                      width: '100%',
                    }}
                  />
                </Form.Item>
              </Col>
              
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    {
                      required: false,
                      message: 'Please input your E-mail!',
                    },
                  ]}
                >
                  <Input placeholder="Please enter email." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your address!',
                    },
                  ]}
                >
                  <TextArea placeholder="Please input your address." allowClear />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  name="nationId"
                  label="Country"
                  rules={[
                    {
                      required: true,
                      message: 'Please select country!',
                    },
                  ]}
                >
                  <Select placeholder="Select Country">
                    <Option value="1">India</Option>
                    
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
                <Form.Item
                  name="provinceOrStateId"
                  label="Province/ State"
                  rules={[
                    {
                      required: true,
                      message: 'Please select Province/ State!',
                    },
                  ]}
                >
                  <Select placeholder="Select Province/ State">
                    <Option value="1">Andhra Pradesh</Option>
                    <Option value="2">Arunachal Pradesh</Option>
                    <Option value="3">Assam</Option>
                    <Option value="4">Bihar</Option>
                    <Option value="5">Chhattisgarh</Option>
                    <Option value="6">Goa</Option>
                    <Option value="7">Gujarat</Option>
                    <Option value="8">Haryana</Option>
                    <Option value="9">Himachal Pradesh</Option>
                    <Option value="10">Jharkhand</Option>
                    <Option value="11">Karnataka</Option>
                    <Option value="12">Kerala</Option>
                    <Option value="13">Madhya Pradesh</Option>
                    <Option value="14">Maharashtra</Option>
                    <Option value="15">Manipur</Option>
                    <Option value="16">Meghalaya</Option>
                    <Option value="17">Mizoram</Option>
                    <Option value="18">Nagaland</Option>
                    <Option value="19">Odisha</Option>
                    <Option value="20">Punjab</Option>
                    <Option value="21">Rajasthan</Option>
                    <Option value="22">Sikkim</Option>
                    <Option value="23">Tamil Nadu</Option>
                    <Option value="24">Telangana</Option>
                    <Option value="25">Tripura</Option>
                    <Option value="26">Uttar Pradesh</Option>
                    <Option value="27">Uttarakhand</Option>
                    <Option value="28">West Bengal</Option>
                    <Option value="29">Andaman and Nicobar Islands</Option>
                    <Option value="30">Chandigarh</Option>
                    <Option value="31">Dadra and Nagar Haveli and Daman and Diu</Option>
                    <Option value="32">Delhi</Option>
                    <Option value="33">Ladakh</Option>
                    <Option value="34">Lakshadweep</Option>
                    <Option value="35">Puducherry</Option>
                    
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                  name="docOrIdCardTypeId"
                  label="ID Type"
                  rules={[
                    {
                      required: false,
                      message: 'Please select ID type!',
                    },
                  ]}
                >
                  <Select placeholder="Select ID type">
                    <Option value="1">Voter ID</Option>
                    <Option value="2">Driving Licence</Option>
                    <Option value="3">Aadhar</Option>
                    <Option value="4">Ration</Option>
                    <Option value="5">Bank Passbook</Option>
                    <Option value="6">Passport</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
                <Form.Item
                  label="ID Proof Number"
                  name="docOrIdCardNumber"
                  // noStyle
                  rules={[
                    {
                      required: false,
                      message: 'Please input ID Proof number.',
                    },
                  ]}
                >
                  <Input placeholder="Please enter ID Proof number" />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
                      <Form.Item
                          label="Upload your photo"
                          name="profileImageDocUrlId"
                          initialValue={profileImageDocUrlId}
                          rules={[
                            {
                              required: false,
                              message: 'Please Upload your photo.',
                            },
                          ]}
                        >
                          <ImgCrop rotate>
                            <Upload
                              action={`${backendHost}/utilityservice/api/upload`}
                              listType="picture-card"
                              fileList={fileList}
                              onChange={onChangeProfileImage}
                              onPreview={onPreview}
                              maxCount={1}
                            >
                              {fileList.length < 1 && '+ Upload'}
                            </Upload>
                          </ImgCrop>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
                    <Form.Item
                          label="Upload ID Proof"
                          name="docOrIdCardUrlId"
                          initialValue={docOrIdCardUrlId}
                          rules={[
                            {
                              required: false,
                              message: 'Please Upload ID Proof.',
                            },
                          ]}
                        >
                           <Upload
                            action={`${backendHost}/utilityservice/api/upload`}
                            name= 'file'
                            listType="picture"
                            maxCount={1}
                            multiple={false}
                            onChange={onChangeDocumentUpload}
                          >
                            {/* {fileList.length < 1 && '+ Upload ID Card'} */}
                            <Button icon={<UploadOutlined />}>Upload ID Proof</Button>
                          </Upload>

                          {/* <ImgCrop rotate>
                            <Upload
                              // action="http://34.67.196.143:9002/utilityservice/api/upload"
                              action="http://localhost:9002/utilityservice/api/upload"
                              // action="http://localhost:8083/api/upload"
                              listType="picture-card"
                              fileList={fileList}
                              onChange={onChange}
                              onPreview={onPreview}
                            >
                              {fileList.length < 1 && '+ Upload'}
                            </Upload>
                          </ImgCrop> */}
                        </Form.Item>
                </Col>
            </Row>



            
            
            <Divider orientation="left">Referrals</Divider>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="First Referral Full Name"
                  name="referralFullName1"
                  // noStyle
                  rules={[
                    {
                      required: false,
                      message: 'Please input first referral full name!',
                    },
                  ]}
                >
                  <Input placeholder="Please enter first referral full neme" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
                <Form.Item
                  name="referralPhone1"
                  label="First Referral Phone Number"
                  rules={[
                    {
                      required: false,
                      message: 'Please input first referral phone number!',
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter First Referral Phone Number"
                    addonBefore={prefixSelector}
                    style={{
                      width: '100%',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                  name="referralEmail1"
                  label="First Referral E-mail"
                  rules={[
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    {
                      required: false,
                      message: 'Please input your E-mail!',
                    },
                  ]}
                >
                  <Input placeholder="Please enter first referral email." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}> 

              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="Second Referral Full Name"
                  name="referralFullName2"
                  // noStyle
                  rules={[
                    {
                      required: false,
                      message: 'Please input second referral full name!',
                    },
                  ]}
                >
                  <Input placeholder="Please enter second referral full neme" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
                <Form.Item
                  name="referralPhone2"
                  label="Second Referral Phone Number"
                  rules={[
                    {
                      required: false,
                      message: 'Please input second referral phone number!',
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter Second Referral Phone Number"
                    addonBefore={prefixSelector}
                    style={{
                      width: '100%',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                  name="referralEmail2"
                  label="Second Referral E-mail"
                  rules={[
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    {
                      required: false,
                      message: 'Please input your E-mail!',
                    },
                  ]}
                >
                  <Input placeholder="Please enter second referral email." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
                
              </Col>
            </Row>
            <Divider />
            

            <Row gutter={24}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                
              {/* <Form.Item>
                <Button  style={{ width: "50%" }} type="primary" htmlType="button" onClick={backToHome}>
                  Back to Home
                </Button>
              </Form.Item> */}
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
              <Form.Item {...tailFormItemLayout}>
                <Button style={{ width: "50%" }} type="primary" htmlType="submit">
                  Register
                </Button>
              </Form.Item>
              </Col>
            </Row>
            
        </Form>
        </Content>
      </Layout>
      </Spin>
    </Layout>
    </>
  );
};

export default UserRegistration;