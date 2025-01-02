import { useEffect, useState } from "react";
import "./gridLevel1_1.css";
import { patchGridData } from "../../apis/grid";

function GridLevel1_Main({
  getGridApiCall,
  normalDataIndex,
  normalData,
  setNormalData,
}) {
  // const [mainTitle, setMainTitle] = useState(item =>
  //   item.filter(item.depth === 0 && item.title === ""),
  // );
  // 현재 선택된 객체의 정보 한개를 보관
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 팝업창에 보여줄 변경 되고 있는 데이터
  const [selectData, setSelectData] = useState({
    title: "",
    contents: "",
    startDate: "",
    finishDate: "",
    completedFg: "0",
  });
  // 현재 9칸의 데이터를 가지고 있음.
  const [showData, setShowData] = useState();

  const handleSubmit = async event => {
    event.preventDefault(); // 기본 동작 방지
    await saveModalData();
  };

  useEffect(() => {
    setShowData(normalData[normalDataIndex]);
  }, [normalData, normalDataIndex]);
  // 모달 열기(주, 서브 목표 빈칸 경고창 포함 )
  const openModal = id => {
    // 선택된 객체 정보 한개를 보관]

    if (Array.isArray(showData) && showData[4].title === "") {
      if (
        showData[4] === normalData[4]?.[4] &&
        normalData[4]?.[4].title === ""
      ) {
        normalData[4][4].title = "주 목표";
        alert("주 목표를 먼저 입력해주세요");
        openModal(normalData[4][4].cellId);
      }
      if (showData[4].title === "") {
        showData[4].title = "서브 목표";
        openModal(showData[4].cellId);
        alert("서브 목표를 먼저 입력해주세요");
      }
    } else {
      const nowSelectItem = showData.find(item => item.cellId === id);
      setSelectData(nowSelectItem);
      setIsModalOpen(true);
    }
    // 완료미완료 선택창 제외 셀 case
    // console.log(normalData[4][0].bgColor);
  };

  // 모달 입력값 변경 처리
  const handleModalChange = e => {
    const { name, value } = e.target;
    setSelectData(prevData => ({ ...prevData, [name]: value }));
  };

  // 모달 데이터 저장
  const saveModalData = async () => {
    // 9개의 보여지고 있는 데이터를 변경된 데이터로 변경
    const newShowData = showData.map(item => {
      if (item.cellId === selectData.cellId) {
        return { ...selectData };
      }
      return item;
    });

    // 원본 데이터 참조
    const updatedNormalData = normalData.map(originalItem => {
      // 원본 데이터를 복사하여 수정
      const updatedOriginalItem = originalItem.map(itemNow => {
        const bindedItem = newShowData.find(
          item =>
            item.isbindKey === itemNow.cellId || item.cellId === itemNow.cellId,
        );

        if (bindedItem) {
          // console.log(bindedItem);
          return {
            ...itemNow,
            title: bindedItem.title,
            contents: bindedItem.contents,
            startDate: bindedItem.startDate,
            finishDate: bindedItem.finishDate,
            mandalartId: bindedItem.mandalartId,
            parentId: bindedItem.parentId,
            completedFg: bindedItem.completedFg,
          };
        }

        return itemNow;
      });
      return updatedOriginalItem;
    });
    console.log(updatedNormalData);
    // console.log(updatedNormalData);
    // const uploadDataForm =  selectData.value =>
    //   ;

    // 원본 데이터와 showData 동기화
    const updatedSelectData = newShowData.find(
      item => item.cellId === selectData.cellId,
    );
    try {
      const res = await patchGridData(updatedSelectData); // 서버 동기화
      console.log(res.data);
    } catch (error) {
      console.error("Error updating data:", error);
    }

    setNormalData(updatedNormalData);
    setShowData(newShowData);
    setSelectData(updatedSelectData);

    console.log(selectData);
    if (selectData.title === "") {
      alert("목표을 입력해주세요");
    }
    // console.log(showData);

    // 날짜 경고창

    if (selectData.startDate === null || selectData.finishDate === null) {
      const isNormalDataInvalid =
        selectData === normalData?.[4]?.[4] &&
        (selectData.startDate === null || selectData.finishDate === null);

      const isNewShowDataInvalid =
        selectData === newShowData?.[4] &&
        (selectData.startDate === null || selectData.finishDate === null);

      const isDateRangeInvalid =
        (selectData.startDate < normalData?.[4]?.[4]?.startDate &&
          selectData.finishDate > normalData?.[4]?.[4]?.finishDate) ||
        (selectData.startDate < newShowData?.[4]?.startDate &&
          selectData.finishDate > newShowData?.[4]?.finishDate);

      if (
        !isNormalDataInvalid ||
        !isNewShowDataInvalid ||
        !isDateRangeInvalid
      ) {
        alert("날짜를 확인해주세요.");
      } else {
        setIsModalOpen(false);
        getGridApiCall();
      }
    }

    // 모달 닫기
  };

  useEffect(() => {
    // console.log(normalData);
  }, [showData, normalData]);

  useEffect(() => {
    // console.log("selectData ========== ", selectData);
  }, [selectData]);
  return (
    <div>
      <div className="sub-container">
        {/* 각 셀 */}
        {showData?.map((item, index) => {
          // console.log(showData); // 디버깅용
          return (
            <div
              key={index}
              id={item.cellId}
              onClick={() => openModal(item.cellId)}
              className="sub-item"
              style={{
                backgroundColor:
                  item.completedFg === 1 ? item.bgColor : "transparent", // 조건에 따른 색상 설정
              }}
            >
              {item.title}
            </div>
          );
        })}
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit}>
            <div className="modal">
              <label>
                제목:
                <input
                  type="text"
                  name="title"
                  value={selectData?.title || ""}
                  onChange={handleModalChange}
                />
              </label>
              <label>
                세부 내용:
                <input
                  name="contents"
                  type="text"
                  value={selectData?.contents || ""}
                  onChange={handleModalChange}
                />
              </label>
              <label>
                시작 날짜:
                <input
                  className="planDate"
                  type="date"
                  name="startDate"
                  value={selectData.startDate || ""}
                  onChange={handleModalChange}
                />
              </label>
              <label>
                종료 날짜:
                <input
                  className="planDate"
                  type="date"
                  name="finishDate"
                  value={selectData.finishDate || ""}
                  onChange={handleModalChange}
                />
              </label>
              {/* depth가 0또는 1이면 보이지 마라 */}
              {!(selectData?.depth === 0 || selectData?.depth === 1) && (
                <div className="selectbox">
                  <select
                    name="completedFg"
                    value={selectData.completedFg}
                    onChange={handleModalChange}
                  >
                    <option value="0">미완료</option>
                    <option value="1">완료</option>
                  </select>
                </div>
              )}

              <div className="modal-buttons">
                <button type="submit">저장</button>
                <button onClick={() => setIsModalOpen(false)}>취소</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default GridLevel1_Main;
