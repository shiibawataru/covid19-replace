import React from "react";
import styled from "styled-components";

const Footer = styled.div`
  display: flex;
  /* justify-content: center;
  align-items: center; */
  height: 100px;
  color: #ffffff;
  background-color: #ad222f;
  position: absolute;
  bottom: 0;
  width: 100%;
  /* margin-top: auto; */
`;

const ImgWrapper = styled.div`
  /* height: 10px; */
  margin: auto;
`;

const Img = styled.img`
  height: 70px;
  /* width: 30%; */
`;

const footer = () => {
  return (
    <div>
      <Footer>
        <ImgWrapper>
          <a href="https://note.stopcovid19.jp/n/n0b078f2b3dce">
            <Img
              src="/images/notestopcovid19-banner.png"
              alt="コロナ専門家　有志の会"
            />
          </a>
        </ImgWrapper>
        <ImgWrapper>
          <Img src="/images/tellus.png" alt="How are you? Tell us" />
        </ImgWrapper>
        <ImgWrapper>
          <a href="https://whowatch.tv/">
            <Img src="/images/whowatch-banner.png" alt="ふわっち" />
          </a>
        </ImgWrapper>
      </Footer>
    </div>
  );
};

export default footer;
