import React, { useState, useEffect } from 'react';
import "./login.css";
import userApi from "../../apis/userApi";
import { useHistory } from "react-router-dom";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, Divider, Alert, notification } from 'antd';
import backgroundLogin from "../../assets/image/background-login.png";

const Login = () => {

  const [isLogin, setLogin] = useState(true);

  let history = useHistory();

  const onFinish = values => {
    userApi.login(values.username, values.password)
      .then(function (response) {
        if (response === undefined) {
          setLogin(false);
        }
        else {
          (async () => {
            try {
              if (response.details.role === "isAdmin" && response.details.status === "actived") {
                history.push("/dash-board");
              } else if (response.details.role === "isCompany" && response.details.status === "actived"){
                history.push("/hotel-list");
                
              }else{
                notification["error"]({
                  message: `Thông báo`,
                  description:
                    'Bạn không có quyền truy cập vào hệ thống',

                });
              }
            } catch (error) {
              console.log('Failed to fetch ping role:' + error);
            }
          })();
        }
      })
      .catch(error => {
        console.log("email or password error" + error)
      });
  }
  useEffect(() => {

  }, [])

  const handleLink = () => {
    history.push("/register");
  }

  return (
    <div className="imageBackground">
      <div id="formContainer" >
        <div id="form-Login">
          <div className="formContentLeft"
          >
            <img className="formImg" src={backgroundLogin} alt='spaceship' />
          </div>
          <Form
            style={{ width: 340, marginBottom: 8 }}
            name="normal_login"
            className="loginform"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item style={{ marginBottom: 3, marginTop: 65 }}>
              <Divider style={{ marginBottom: 5, fontSize: 19 }} orientation="center">CHÀO MỪNG BẠN ĐẾN VỚI HOTELOKA!</Divider>
            </Form.Item>
            <Form.Item style={{ marginBottom: 16, textAlign: "center" }}>
              <p className="text">Đăng nhập để vào hệ thống quản lý</p>
            </Form.Item>
            <>
              {isLogin === false ?
                <Form.Item style={{ marginBottom: 16 }}>
                  <Alert
                    message="Tài khoản hoặc mật khẩu sai"
                    type="error"
                    showIcon
                  />

                </Form.Item>
                : ""}
            </>
            <Form.Item
              style={{ marginBottom: 20 }}
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên!',
                },
              ]}
            >
              <Input
                style={{ height: 34, borderRadius: 5 }}
                prefix={<UserOutlined className="siteformitemicon" />}
                placeholder="Họ và tên" />
            </Form.Item >
            <Form.Item
              style={{ marginBottom: 8 }}
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="siteformitemicon" />}
                type="password"
                placeholder="Mật khẩu"
                style={{ height: 34, borderRadius: 5 }}
              />
            </Form.Item>
            <Form.Item >
                <div onClick={() => handleLink()} className="register">Bạn là công ty? Đăng ký</div>
              </Form.Item>

            <Form.Item style={{ width: '100%', marginTop: 20 }}>
              <Button className="button" type="primary" htmlType="submit"  >
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;



