import { useContext, useEffect, useState } from "react";

import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserInfoContext } from "../../contexts/UserInfoContext";
import PopupLayout from "../../components/PopupLayout";

const MyplanWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  .writeWrap {
    border-top: 1px solid #242424;
  }
  .writeWrap .inputBox input[type="text"] {
    width: 95%;
  }
  .writeWrap .inputBox textarea {
    width: 95%;
    height: 100px;
    padding: 15px 10px;
    resize: vertical;
  }
  .guide {
    margin-bottom: 30px;
    color: #666;
    font-size: 14px;
  }
  .guide h4 {
    margin-bottom: 5px;
    color: #242424;
    font-size: 16px;
    font-weight: 500;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 5px;
  color: #55ad9b;
  font-size: 13px;
`;

const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 40px;
  border-top: 1px solid #eee;
`;

//schema 먼저 생성
const addSchema = yup.object({
  title: yup.string().required("제목을 입력해 주세요!"),
  content: yup.string().required("간단 소개글을 입력해 주세요."),
  /*
  pic: yup
    .mixed()
    .test("fileType", "이미지(jpg, png) 파일만 첨부가능합니다.", value => {
      return value && ["image/jpeg", "image/png"].includes(value[0]?.type);
    })
    .test("filesize", "파일 크기는 500KB 이하만 가능합니다.", value => {
      return value && value[0]?.size <= 0.5 * 1024 * 1024; // 500KB 이하
    }),
  */
});

function AddMandalart() {
  const divBox = 81; //총 div
  const [isAddVisible, setIsAddVisible] = useState(false); //복사하기 팝업

  const closeModal = () => {
    setIsAddVisible(false);
  };

  const { userInfo } = useContext(UserInfoContext);
  //const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addSchema),
    defaultValues: {
      mid: "",
      title: "",
      content: "",
      pic: "",
    },
    mode: "all",
  });

  const handleSubmitForm = data => {
    alert("ok");
    //모아둔 전송할 데이터(axios.post전송)
    console.log(data);
  };

  useEffect(() => {
    //console.log(userInfo);
    if (!userInfo.userId) {
      //alert("회원 로그인이 필요합니다.");
      //navigate("/login");
    }
    return () => {};
  }, []);

  return (
    <>
      <MyplanWrap>
        <h1 className="subTitle">나의 만다라트</h1>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="writeWrap">
            <input type="hidden" value="test@test.com" {...register("mid")} />
            <div className="inputBox">
              <label htmlFor="title">
                제목 <span>*</span>
              </label>
              <div style={{ width: "100%" }}>
                <input type="text" id="title" {...register("title")} />
                {errors.title?.message && (
                  <ErrorMessage>({errors.title?.message})</ErrorMessage>
                )}
              </div>
            </div>
            <div className="inputBox">
              <label htmlFor="content">
                간단 소개글 <span>*</span>
              </label>
              <div style={{ width: "100%", fontSize: "0px" }}>
                <textarea
                  id="content"
                  placeholder="간단 소개글을 입력해 주세요."
                  {...register("content")}
                />
                {errors.content?.message && (
                  <ErrorMessage>({errors.content?.message})</ErrorMessage>
                )}
              </div>
            </div>
            <div className="inputBox">
              <label htmlFor="content">섬네일 등록</label>
              <input type="file" {...register("pic")} />

              <button type="submit" className="btnColor">
                저장하기
              </button>
            </div>
          </div>
        </form>

        <div className="inputBox borderNone">
          <label htmlFor="content">계획표 작성</label>
          <div>
            <div className="guide">
              <h4>만다라트 계획표 작성 방법</h4>
              1. 핵심 목표 설정 : 이루고 싶은 가장 중요한 목표를 1개를
              설정합니다.
              <br />
              2. 세부 목표 설정 : 핵심 목표를 달성하기 위한 8개의 세부 목표를
              설정합니다.
              <br />
              3. 실행 계획 작성 : 각 세부 목표를 달성하기 위한 구체적인 실행
              계획을 8개씩 총 64개의 칸에 적습니다.
              <br />
              4. 계획표 관리 : 계획표를 정기적으로 검토하고 수정하며 실행합니다.
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "1003px",
                border: "2px solid #666",
              }}
            >
              {/* 만다라트 계획표 출력 */}
              {[...Array(divBox)].map((item, index) => {
                return index < divBox ? (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "111px",
                      height: "111px",
                      borderRight: "1px solid #eee",
                      borderBottom: "1px solid #eee",
                      backgroundColor: `${index === 40 ? "#D8EFD3" : ""}`,
                    }}
                    onClick={() => setIsAddVisible(true)}
                  >
                    {index + 1}
                  </div>
                ) : (
                  ""
                );
              })}
            </div>
          </div>
        </div>

        <ButtonWrap>
          <Link to={"/myplan"} className="btnColor">
            목록으로
          </Link>
        </ButtonWrap>
      </MyplanWrap>

      {isAddVisible && (
        <PopupLayout isVisible={isAddVisible} onClose={closeModal} title={""}>
          <form>
            <input type="hidden" value="1" {...register("idx")} />
            <input type="hidden" value="test@test.com" {...register("mid")} />
            <div className="inputBox">
              <label htmlFor="titlePop">
                실천목표 입력<span>*</span>
              </label>
              <input type="text" id="titlePop" {...register("titlePop")} />
            </div>
            <div className="inputBox">
              <label htmlFor="startDate">시작일</label>
              <input type="date" id="startDate" {...register("startDate")} />
            </div>
            <div className="inputBox">
              <label htmlFor="endDate">종료일</label>
              <input type="date" id="endDate" {...register("endDate")} />
            </div>
            <div className="inputBox">
              <label htmlFor="contentPop">세부내용 작성</label>
              <textarea
                id="contentPop"
                placeholder="내용을 입력하세요."
                {...register("contentPop")}
              ></textarea>
            </div>

            <div className="inputBox" style={{ display: "flex" }}>
              <label style={{ minWidth: "auto", margin: "0px 20px 0px 0px" }}>
                달성 여부
              </label>
              <input
                type="radio"
                value="0"
                id="value0"
                {...register("success")}
                checked
              />
              &nbsp;
              <label
                htmlFor="value0"
                style={{ minWidth: "auto", margin: "0px" }}
              >
                진행중
              </label>{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="radio"
                value="1"
                name="success"
                id="value1"
                {...register("success")}
              />
              &nbsp;
              <label
                htmlFor="value1"
                style={{ minWidth: "auto", margin: "0px" }}
              >
                달성 완료
              </label>
            </div>

            <div className="buttonWrap">
              <button
                type="button"
                className="btnPopLine"
                onClick={() => setIsAddVisible(false)}
              >
                취소하기
              </button>
              <button type="submit" className="btnPupColor">
                저장하기
              </button>
            </div>
          </form>
        </PopupLayout>
      )}
    </>
  );
}

export default AddMandalart;
