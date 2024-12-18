import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { postMember } from "../../apis/member";
import SubpageVisual from "../../components/subpageVisual/SubpageVisual";

const MemberJoinWrap = styled.div`
  padding: 0px 50px;

  .joinForm {
    max-width: 75%;
    min-width: 800px;
    margin: 0 auto;
    border-top: 1px solid #242424;
  }

  label {
    display: inline-block;
    min-width: 160px;
  }
  .inputBox {
    display: flex;
    align-items: center;
    padding: 15px 0px;
    border-bottom: 1px solid #eee;
  }
  label span {
    color: #ff3300;
    font-weight: 600;
  }
  .inputBox input {
    min-width: 300px;
  }
`;
const ErrorMessage = styled.p`
  margin-left: 10px;
  color: #ff3300;
  font-size: 13px;
`;

const Agreements = styled.div`
  margin: 40px 0px;
  border: none;
  h2 {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 400;
  }
  .privercy {
    height: 100px;
    margin-bottom: 10px;
    padding: 20px;
    border: 1px solid #ddd;
    color: #666;
    font-size: 14px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .checkAgree {
    display: flex;
    align-items: center;
  }
  .checkAgree label {
    margin-right: 5px;
  }
  .checkAgree input {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
`;
const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  border-top: 1px solid #eee;
`;

//yup 관련 설정
//1. schema를 먼저 설정한다.
const schema = yup.object({
  email: yup
    .string()
    .required("이메일은 필수입니다.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: yup
    .string()
    .required("비밀번호는 필수입니다.")
    .min(8, "비밀번호는 최소 8자 이상입니다.")
    .max(16, "비밀번호는 최대 16자까지 가능합니다.")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "비밀번호는 영어/숫자/특수문자 포함 8자리 이상으로 입력해주세요.",
    ),
  password_confirm: yup
    .string()
    .required("비밀번호 확인은 필수입니다.")
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다."),
  nickname: yup
    .string()
    .required("닉네임은 필수입니다.")
    .max(10, "닉네임은 최대 10자까지 가능합니다."),
  policy: yup.boolean().oneOf([true], "필수"),
});

function JoinPage() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      password_confirm: "",
      nickname: "",
      policy: false,
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async data => {
    try {
      const result = await postMember(data); //axios 전송하기(등록)
      if (result.data) {
        alert("회원정보 수정이 완료되었습니다.");
        navigate("/login");
      } else {
        //회원가입 실패
        alert("회원가입이 실패되었습니다.\n다시 시도해 주세요.");
      }
    } catch (error) {
      console.log("회원가입 실패:", error);
    }
  };

  return (
    <>
      <SubpageVisual></SubpageVisual>

      <MemberJoinWrap>
        <h1 className="subTitle">회원가입</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="joinForm">
            <div className="inputBox">
              <label htmlFor="email">
                이메일 <span>*</span>
              </label>
              <input
                type="text"
                id="email"
                maxLength={30}
                {...register("email")}
              />
              <button type="button" className="btnLine">
                중복체크
              </button>
              {/* 에러내용 출력 */}
              {errors.email && (
                <ErrorMessage>({errors.email?.message})</ErrorMessage>
              )}
            </div>

            <div className="inputBox">
              <label htmlFor="password">
                비밀번호 <span>*</span>
              </label>
              <input
                type="password"
                id="password"
                maxLength={16}
                {...register("password")}
              />
              {/* 에러내용 출력 */}
              {errors.password && (
                <ErrorMessage>({errors.password?.message})</ErrorMessage>
              )}
            </div>

            <div className="inputBox">
              <label htmlFor="password_confirm">
                비밀번호 확인 <span>*</span>
              </label>
              <input
                type="password"
                id="password_confirm"
                maxLength={16}
                {...register("password_confirm")}
              />
              {/* 에러내용 출력 */}
              {errors.password_confirm && (
                <ErrorMessage>
                  ({errors.password_confirm?.message})
                </ErrorMessage>
              )}
            </div>

            <div className="inputBox">
              <label htmlFor="nickname">
                닉네임 <span>*</span>
              </label>
              <input
                type="text"
                id="nickname"
                maxLength={10}
                {...register("nickname")}
              />
              <button type="button" className="btnLine">
                중복체크
              </button>
              {/* 에러내용 출력 */}
              {errors.nickname && (
                <ErrorMessage>({errors.nickname?.message})</ErrorMessage>
              )}
            </div>

            <div className="inputBox">
              <label htmlFor="profile">프로필 등록</label>
              <input type="file" id="profile" {...register("profile")} />
            </div>

            <Agreements>
              <h2>[필수] 개인정보처리방침</h2>
              <div className="privercy">
                회사명칭(이하 '회사')은(는) 개인정보보호법에 따라 이용자의
                개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의
                고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고
                있습니다. '회사' 개인정보처리방침을 개정하는 경우 웹사이트
                공지사항(또는 개별공지)을 통하여 공지할 것입니다. ○ 본
                방침은부터 2021년 1월 1일부터 시행됩니다. 1. 개인정보의 처리
                목적 '회사'는 개인정보를 다음의 목적을 위해 처리합니다. 처리한
                개인정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용
                목적이 변경될 시에는 사전동의를 구할 예정입니다. 가. 홈페이지
                회원가입 및 관리 회원제 서비스 제공에 따른 본인 식별·인증,
                제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지
                등을 목적으로 개인정보를 처리합니다. 나. 민원사무 처리 민원인의
                신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과
                통보 등을 목적으로 개인정보를 처리합니다. 다. 재화 또는 서비스
                제공 서비스 제공 등을 목적으로 개인정보를 처리합니다. 라. 마케팅
                및 광고에의 활용 서비스의 유효성 확인, 접속빈도 파악 또는 회원의
                서비스 이용에 대한 통계 등을 목적으로 개인정보를 처리합니다.
              </div>

              <div className="checkAgree">
                <input type="checkbox" id="agreement" {...register("policy")} />
                <label htmlFor="agreement">이용약관에 동의합니다.</label>

                {/* 에러내용 출력 */}
                {errors.policy && (
                  <span style={{ color: "#ff3300", fontSize: "14px" }}>
                    ({errors.policy?.message})
                  </span>
                )}
              </div>
            </Agreements>

            <ButtonWrap>
              <button type="button" className="btnLine" onClick={() => reset()}>
                다시작성
              </button>
              <button type="button" className="btnLine">
                취소하기
              </button>
              <button type="submit" className="btnColor">
                회원가입하기
              </button>
            </ButtonWrap>
          </div>
        </form>
      </MemberJoinWrap>
    </>
  );
}

export default JoinPage;
