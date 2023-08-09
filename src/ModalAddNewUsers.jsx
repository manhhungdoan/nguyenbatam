import {Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Spin} from "antd";
import {useState} from "react";
import {isEmpty} from "lodash";
import {ACTION_TYPE, LIST_DOB} from "./utils/const/const.js";
import {actionAddUsers, actionUpdateUsers} from "./action.js";
import data from "bootstrap/js/src/dom/data.js";
import dayjs from "dayjs";
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';

const ModalAddNewUsers = (props) => {
    const {onCancel, onSuccess, user, actionType} = props;
    const isAdd = isEmpty(user);
    const [form] = Form.useForm();
    const [isProcessing, setProcessing] = useState(false);
    const initialValues = {
        ...user,
        dob: dayjs.unix(user?.dob)
    }
    const handleSubmit = async (values) => {
        setProcessing(true);
        let data = {
            ...values,
            dob: dayjs(values?.dob).unix()
        }
        try {
            if (actionType === ACTION_TYPE.ADD) {
                let res = await actionAddUsers(data);
                if (res?.status === 200) {
                    message.success("Thêm thành công");
                    onSuccess();
                }
            } else {
                if (user) {
                    let res = await actionUpdateUsers(user?.customerId, data);
                    if (res?.status === 200) {
                        message.success("Chỉnh sửa thành công");
                        onSuccess();
                    }
                }
            }

        } catch (e) {
            message.error(e?.data?.status?.message || "Lỗi hệ thống");
        }
        setProcessing(false);
    }
    return (
        <Modal
            title={actionType === ACTION_TYPE.ADD ? "Thêm người dùng mới" : actionType === ACTION_TYPE.UPDATE ? "Chỉnh sửa người dùng" : "Thông tin chi tiết"}
            className='modal-form'
            width='650px'
            open={true}
            closable={true}
            onCancel={() => onCancel()}
            okText={"Lưu"}
            okButtonProps={{style: {display: actionType === ACTION_TYPE.VIEW ? 'none' : 'inline'}}}
            cancelText={actionType === ACTION_TYPE.VIEW ? "Đóng" : "Huỷ"}
            onOk={() => form.submit()}
            confirmLoading={false}
        >
            <Spin spinning={isProcessing}>
                <Form
                    form={form}
                    initialValues={user && initialValues}
                    onFinish={handleSubmit}
                    layout={'vertical'}
                    contentEditable={false}
                    disabled={actionType === ACTION_TYPE.VIEW}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên"
                                name='name'
                                rules={[{
                                    required: true,
                                    message: "Vui lòng nhập tên"
                                }]}
                            >
                                <Input placeholder="Tên"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name='email'
                                rules={[{
                                    required: true,
                                    message: "Vui lòng nhập email",
                                    type: 'email'
                                }]}
                            >
                                <Input placeholder="example@email.com"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số điện thoại"
                                name='phone'
                                rules={[{
                                    required: true,
                                    message: "Vui lòng nhập số điện thoại"
                                }]}
                            >
                                <Input placeholder="Số điện thoại"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Mật khẩu"
                                name='password'
                                rules={[{
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu"
                                }]}
                            >
                                <Input.Password placeholder="Mật khẩu"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày sinh"
                                name='dob'
                                rules={[{
                                    required: true,
                                    message: "Vui lòng chọn ngày sinh"
                                }]}
                            >
                                <DatePicker
                                    placeholder="Chọn ngày sinh"
                                    style={{
                                        width: '100%',
                                    }}
                                    locale={locale}
                                    format={"DD/MM/YYYY"}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Địa chỉ"
                                name='address'
                            >
                                <Input placeholder="Địa chỉ"/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    )
}
export default ModalAddNewUsers;