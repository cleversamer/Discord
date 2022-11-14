import styled from "styled-components";
import DiscordIcon from "../icons/DiscordIcon";
import PlusIcon from "../icons/PlusIcon";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  return (
    <Container>
      <SidebarItem main hint="Direct Messages">
        <DiscordIcon />
      </SidebarItem>

      <SeparateLine />

      <SubContainer>
        <SidebarItem featured hint="Add a Server">
          <PlusIcon />
        </SidebarItem>

        <SidebarItem
          type="item"
          imageURL="https://avatars.githubusercontent.com/u/73291969?v=4"
          hint="Samer's server"
        />
      </SubContainer>
    </Container>
  );
};

const Container = styled.aside`
  width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #202225;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const SeparateLine = styled.div`
  min-width: 32px;
  min-height: 2px;
  border-radius: 2px;
  background-color: #4f545c7a;
  margin-top: 10px;
  margin-bottom: 15px;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export default Sidebar;
