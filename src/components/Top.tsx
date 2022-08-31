import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { readRemoteFile } from "react-papaparse";

//Styled CSS
//////////////////////
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  @media screen and (max-width: 950px) {
    flex-wrap: wrap;
  }
  margin-top: 20px;
`;
const LeftWrapper = styled.div`
  height: 200px;
  /* margin-top: 10px; */
  margin-left: 5vw;
  margin-right: 50px;
  flex-basis: 45%;
  @media screen and (max-width: 950px) {
    height: 100%;
    margin: 20px;
    flex-basis: 90%;
  }
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  border: 1px solid;
  border-color: #ad222f;
`;

const Delimiter = styled.div`
  border: 1px solid;
  border-color: #ad222f;
  width: 50%;
`;

const NumericalValue = styled.div`
  color: #ffffff;
  background-color: #ad222f;
  height: 6vh;
  font-size: 3.5vh;
  font-weight: bold;
`;

const LowerRow = styled.div`
  border: 2px solid;
  border-color: #ad222f;
`;

const RightWrapper = styled.div`
  display: grid;
  margin-right: 5vw;
  flex-basis: 55%;
  justify-content: center;
  grid-gap: 5px;
  grid-template-rows: repeat(7, 4.5vw);
  grid-template-columns: repeat(7, 7vw);
  width: fit-content;
  font-size: 1vw;
  font-weight: bold;
  @media screen and (max-width: 950px) {
    flex-basis: 90%;
    grid-template-rows: repeat(7, 7vw);
    grid-template-columns: repeat(7, 11vw);
  }
`;

const Data = styled.div`
  background-color: #000000;
  color: #ffffff;
  /* 上下左右中心にする */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
`;
const DataNum = styled.div`
  font-size: 0.6vw;
`;
const Data2 = styled.div`
  background-color: #000000;
  color: #ffffff;
  grid-column: span 2;
  /* 上下左右中心にする */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 100%;
`;

const UnderWrapper = styled.div`
  margin: 50px;
`;
const GraphButton = styled.button`
  font-size: 1.5vw;
  width: 10vw;
  height: 5vh;
  cursor: pointer;
`;

const UpStyle = styled.span`
  color: #ad222f;
  font-weight: 900;
  font-size: x-large;
`;
const DownStyle = styled.span`
  color: white;
  font-weight: 900;
  font-size: x-large;
`;

type PrefPatientsDataType = {
  srcurl_pdf: string;
  srcurl_web: string;
  description: string;
  lastUpdate: string;
  npatients: number;
  nexits: number;
  ndeaths: number;
  ncurrentpatients: number;
  ninspections: number;
  nheavycurrentpatients: number;
  nunknowns: number;
  area: [
    {
      name: string;
      name_jp: string;
      ncurrentpatients: number;
      ndeaths: number;
      nexits: number;
      nheavycurrentpatients: number;
      ninspections: number;
      npatients: number;
      nunknowns: number;
    }
  ];
};

type PrefBedsDataType = {
  都道府県番号: string;
  入院患者受入確保病床: string;
  宿泊施設受入可能室数: string;
  更新日: string;
};

type CsvData3Type = {
  Date: string;
  ALLRequiringinpatientcare?: string;
  救急搬送困難事案数?: string;
};

type TestType = {
  area: [
    {
      name: string;
      name_jp: string;
      ncurrentpatients: number;
      ndeaths: number;
      nexits: number;
      nheavycurrentpatients: number;
      ninspections: number;
      npatients: number;
      nunknowns: number;
    }
  ];
};

const Top = () => {
  const params = useParams();
  const [prefPatientsData, setPrefPatientsData] =
    useState<PrefPatientsDataType>();
  const [prefBedsData, setPrefBedsData] = useState<Array<PrefBedsDataType>>([]);
  //グラフ作成用配列
  const [csvData3, setCsvData3] = useState<Array<CsvData3Type>>([]);
  // 増加減少
  const [increaseDecrease, setIncreaseDecrease] = useState<TestType>();
  const [increaseDecrease1, setIncreaseDecrease1] = useState<TestType>();

  //入院治療を要する者
  const inpatientTreatmentUrl =
    "https://www.stopcovid19.jp/data/mhlw_go_jp/opendata/requiring_inpatient_care_etc_daily.csv";
  //救急搬送困難事案数
  const emergencyTransportationDifficultiesUrl =
    "https://code4fukui.github.io/fdma_go_jp/emergencytransport_difficult_all.csv";

  useEffect(() => {
    //都道府県ごと現在患者数
    axios
      .get("https://www.stopcovid19.jp/data/covid19japan.json")
      //   .then((res) => setPrefPatientsData(res.data.area));
      .then((res) => setPrefPatientsData(res.data));

    //都道府県ごと病床数
    axios
      .get("https://www.stopcovid19.jp/data/covid19japan_beds/latest.json")
      .then((res) => setPrefBedsData(res.data));

    //allData
    axios
      .get("https://www.stopcovid19.jp/data/covid19japan-all.json")
      .then((res) => setIncreaseDecrease(res.data[res.data.length - 1]));
    axios
      .get("https://www.stopcovid19.jp/data/covid19japan-all.json")
      .then((res) => setIncreaseDecrease1(res.data[res.data.length - 1 - 1]));
  }, []);

  //ページ遷移
  const navigate = useNavigate();
  const jumpGraph = () => {
    navigate("/graph");
  };

  return (
    <>
      <Wrapper>
        <LeftWrapper>
          <Flex>
            <Delimiter>
              <div>現在患者数/対策病床数</div>
              <NumericalValue>
                {prefPatientsData &&
                  Math.floor(
                    (prefPatientsData.ncurrentpatients /
                      prefBedsData?.reduce(
                        (p, x) =>
                          p +
                          Number(x.入院患者受入確保病床) +
                          Number(x.宿泊施設受入可能室数),
                        0
                      )) *
                      100
                  ).toLocaleString()}
                %
              </NumericalValue>
            </Delimiter>
            <Delimiter>
              <div>現在患者数</div>
              <NumericalValue>
                {prefPatientsData?.ncurrentpatients.toLocaleString()}人
              </NumericalValue>
            </Delimiter>
          </Flex>
          <Flex>
            <Delimiter>
              <div>累積退院者</div>
              <NumericalValue>
                {prefPatientsData?.nexits.toLocaleString()}人
              </NumericalValue>
            </Delimiter>
            <Delimiter>
              <div>死亡者</div>
              <NumericalValue>
                {prefPatientsData?.ndeaths.toLocaleString()}人
              </NumericalValue>
            </Delimiter>
          </Flex>
          <Flex>
            <Delimiter>
              <div>
                対策病床数&nbsp;
                {prefBedsData &&
                  prefBedsData
                    .reduce(
                      (p, x) =>
                        p +
                        Number(x.入院患者受入確保病床) +
                        Number(x.宿泊施設受入可能室数),
                      0
                    )
                    .toLocaleString()}
                床
              </div>
            </Delimiter>
            <Delimiter>
              <div>
                PCR検査陽性者数&nbsp;
                {prefPatientsData?.npatients.toLocaleString()}人
              </div>
            </Delimiter>
          </Flex>
          <LowerRow>
            <div>
              臨床工学技士 14,378人 / 人工呼吸器 28,197台 / ECMO 1,412台
            </div>
            <div>
              2020年3月回答 出典
              <a href="https://ja-ces.or.jp/info-ce/%e4%ba%ba%e5%b7%a5%e5%91%bc%e5%90%b8%e5%99%a8%e3%81%8a%e3%82%88%e3%81%b3ecmo%e8%a3%85%e7%bd%ae%e3%81%ae%e5%8f%96%e6%89%b1%e5%8f%b0%e6%95%b0%e7%ad%89%e3%81%ab%e9%96%a2%e3%81%99%e3%82%8b%e7%b7%8a/">
                公益社団法人 日本臨床工学技士会
              </a>
            </div>
          </LowerRow>
          <div>現在患者数 更新日:{prefPatientsData?.lastUpdate}</div>
          {/* 更新日は東京都基準 */}
          <div>対策病床数 発表日:{prefBedsData[14]?.更新日}</div>
        </LeftWrapper>
        <RightWrapper>
          {/* <Table>
          <Tr> */}
          <Link
            to={`/whole`}
            state={{
              state: prefPatientsData,
              beds: prefBedsData.reduce(
                (p, x) =>
                  p +
                  Number(x.入院患者受入確保病床) +
                  Number(x.宿泊施設受入可能室数),
                0
              ),
            }}
            style={{
              textDecoration: "none",
              gridColumn: "span 2",
            }}
          >
            <Data2>
              <div>
                {prefPatientsData?.ncurrentpatients.toLocaleString()}/
                {prefBedsData &&
                  prefBedsData
                    .reduce(
                      (p, x) =>
                        p +
                        Number(x.入院患者受入確保病床) +
                        Number(x.宿泊施設受入可能室数),
                      0
                    )
                    .toLocaleString()}
              </div>
              <div>(全国) 現在患者数 / 対策病床数</div>
            </Data2>
          </Link>
          {prefPatientsData &&
            prefPatientsData.area.map((data, index) => {
              return (
                <Link
                  key={index}
                  style={{ textDecoration: "none" }}
                  to={`/${data.name}`}
                  state={{
                    state: data,
                    beds:
                      Number(prefBedsData[index].入院患者受入確保病床) +
                      Number(prefBedsData[index].宿泊施設受入可能室数),
                    prefId: Number(prefBedsData[index].都道府県番号),
                  }}
                >
                  <Data key={data.name}>
                    <div>
                      <span> {data.name_jp}</span>
                      {Number(increaseDecrease?.area[index].ncurrentpatients) -
                        Number(
                          increaseDecrease1?.area[index].ncurrentpatients
                        ) >
                      0 ? (
                        <UpStyle>↑</UpStyle>
                      ) : (
                        <DownStyle>↓</DownStyle>
                      )}
                    </div>
                    <div>
                      {prefBedsData &&
                        Math.floor(
                          (data.ncurrentpatients /
                            (Number(prefBedsData[index].入院患者受入確保病床) +
                              Number(
                                prefBedsData[index].宿泊施設受入可能室数
                              ))) *
                            100
                        )}
                      %
                    </div>
                    <DataNum>
                      {data.ncurrentpatients.toLocaleString()}/
                      {prefBedsData &&
                        (
                          Number(prefBedsData[index].入院患者受入確保病床) +
                          Number(prefBedsData[index].宿泊施設受入可能室数)
                        ).toLocaleString()}
                    </DataNum>
                  </Data>
                </Link>
              );
            })}
        </RightWrapper>
      </Wrapper>
      <UnderWrapper>
        <GraphButton type="button" onClick={() => jumpGraph()}>
          概況へ
        </GraphButton>
      </UnderWrapper>
    </>
  );
};

export default Top;
