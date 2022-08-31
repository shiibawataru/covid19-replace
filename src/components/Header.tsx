import React from "react";
import styled from "styled-components";

const Header = styled.div`
  height: 100px;
  color: #ffffff;
  background-color: #ad222f;
`;

const Title = styled.h1`
  font-size: 40px;
  margin: 0;
  padding: 15px;
`;

const header = () => {
  return (
    <div>
      <Header>
        <Title>COVID-19 Japan</Title>
        <div>新型コロナウイルス対策ダッシュボード</div>
      </Header>
    </div>
  );
};

export default header;
