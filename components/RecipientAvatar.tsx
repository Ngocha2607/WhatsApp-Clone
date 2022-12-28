import Avatar from "@mui/material/Avatar";
import styled from "styled-components";
import { useRecipient } from "../hooks/useRecipient";

type Props = ReturnType<typeof useRecipient>

const RecipientAvatar = ({recipient, recipientEmail}: Props) => {
    return (recipient ?.photoURl ? <StyleAvatar src={recipient.photoURl} /> : <StyleAvatar>
        {recipientEmail && recipientEmail[0].toUpperCase()}
    </StyleAvatar>
      
    );
}

const StyleAvatar = styled(Avatar)`
    margin: 5px 15px 5px 5px;
`
export default RecipientAvatar;