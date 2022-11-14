import styled from "styled-components";

const SidebarItem = ({ children, featured, main, hint, imageURL }) => {
  return (
    <Item featured={featured} main={main} name="samer">
      {children || <ItemImage src={imageURL} alt={hint} />}
      {hint && <ItemHint>{hint}</ItemHint>}
    </Item>
  );
};

const Item = styled.div`
  min-width: 48px;
  min-height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ featured }) => (featured ? "#3ba35d" : "#fff")};
  background-color: ${({ featured }) => (featured ? "#36393f" : "#5865f2")};
  border-radius: ${({ main }) => (main ? "15px" : "50%")};
  transition-duration: 176ms;
  cursor: pointer;
  position: relative;

  ::before {
    content: "";
    position: absolute;
    background-color: #fff;
    width: 7px;
    height: 100%;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    transform: translate(-100px);
    transition-duration: 200ms;
  }

  :hover {
    border-radius: 3px;
    color: ${({ featured, main }) => (main || featured ? "#fff" : "#3ba35d")};
    background-color: ${({ featured }) => (featured ? "#3ba35d" : "#5865f2")};

    ::before {
      transform: translate(-35px);
    }
  }

  :hover > span {
    display: block;
  }

  :active {
    transform: scale(0.97);
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`;

const ItemHint = styled.span`
  position: fixed;
  left: 75px;
  color: #eee;
  background-color: #202225;
  padding: 7px 10px;
  width: fit-content;
  max-width: 200px;
  max-height: 32px;
  border-radius: 7px;
  font-size: 15px;
  font-weight: 500;
  display: none;
  text-align: center;
  overflow: hidden;
`;

export default SidebarItem;
