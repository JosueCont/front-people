import styled from "styled-components";

const TreeViewContent = styled.div`
  li {
    div {
      div {
        font-family: "Nunito Sans", sans-serif;
        color: #515152;
        text-transform: uppercase;
        line-height: 20px;
      }
    }
  }
  .titleFirstLevel {
    > div {
      > div {
        font-size: 14px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        :last-child {
          padding-right: 24px;
        }
      }
    }
  }
  .titleSecondLevel {
    margin: 3px 0;
    > div {
      > div {
        font-size: 12px;
        font-weight: 500;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        :last-child {
          padding-right: 24px;
        }
      }
    }
  }
  .titleThirdLevel {
    margin: 3px 0;
    > div {
      > div {
        font-size: 12px;
        font-weight: 500;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        :last-child {
          padding-right: 24px;
        }
      }
    }
  }
  .titleFourthLevel {
    margin: 3px 0;
    > div {
      > div {
        font-size: 12px;
        font-weight: 500;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        :last-child {
          padding-right: 24px;
        }
      }
    }
  }
  .titleFifthLevel {
    margin: 3px 0;
    > div {
      > div {
        font-size: 12px;
        font-weight: 500;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        :last-child {
          padding-right: 24px;
        }
      }
    }
  }
  .addButton {
    position: absolute;
    right: 70%;
    transform: translateY(-35px);
    z-index: 10;
    background: none;
    :hover {
      background: none;
    }
    > span {
      > span {
        color: #000000;
        font-size: 25x;
      }
    }
  }
  .MuiTreeItem-root:focus > .MuiTreeItem-content {
    background: rgba(0, 0, 0, 0.08);
  }
`;

export { TreeViewContent };
