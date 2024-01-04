import React from "react";
import { Col, Row, Select, Slider, Space, Typography } from "antd";
import "./styles.less";

const { Text, Link } = Typography;

export const CustomFooter = () => {
  return (
    <Row justify={"space-around"} align={"middle"} id="parent-footer">
      <Col>
        <Row>
          <Col flex={"auto"}>
            <Text strong>Email Support</Text>
          </Col>
          <Col flex={"auto"}>
            <Link>support@wincase.co</Link>
          </Col>
        </Row>
        <Row>
          <Col flex={"auto"}>
            <Text strong>Support Hours</Text>
          </Col>
          <Col flex={"auto"} push={1}>
            <Text>Mon - Fri 10:00 AM - 6:00 PM EST</Text>
          </Col>
        </Row>
      </Col>
      <Col>&copy; 2023 Aubyn Innovations Inc. All Rights Reserved.</Col>
      <Col>
        <Select placeholder="Select Languages" size="small" />
        <Text strong style={{ display: "block" }}>
          Powered by Google Translate
        </Text>
      </Col>
      <Col>
        <Slider style={{ width: "15em" }} disabled />
        <Text style={{ display: "block" }}>0 GB of 0 GB (0% used)</Text>
      </Col>
    </Row>
  );
};
