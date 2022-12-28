import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import styled from "styled-components";
import WhatsAppLogo from "../assets/whatsapplogo.png";

const Loading = () => {
  return (
    <StyledContainer>
      <StyledImageWrapper>
        <Image
          
          src={WhatsAppLogo}
          alt="whatsapp logo"
          height={200}
          width={200}
        />
      </StyledImageWrapper>
      <CircularProgress />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`;
export default Loading;
