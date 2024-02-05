import { AudioBubble } from "./Bubbles/AudioBubble";
import { Avatar } from "./Bubbles/Avatar";
import { Badge } from "./Bubbles/Badge";
import { CardBubble } from "./Bubbles/CardBubble";
import { FileBubble } from "./Bubbles/FileBubble";
import { FormBubble } from "./Bubbles/FormBubble"
import { SchedulerBubble } from "./Bubbles/SchedulerBubble";
import { ImageBubble } from "./Bubbles/ImageBubble";
import { ListItem } from "./Bubbles/ListItem";
import { Localize } from "./Bubbles/Localize";
import { Receipt } from "./Bubbles/Receipt";
import { SoundManager } from "./Bubbles/SoundManager";
import { StatusIndicator } from "./Bubbles/StatusIndicator";
import { TextBubble } from "./Bubbles/TextBubble";
import { Theme } from "./Bubbles/Theme";
import { VideoBubble } from "./Bubbles/VideoBubble";

const Shared = (props:any) => {
    const {
        activeComponent,
        handleCloseComponentModal,
        showComponentModal,
    } = props;
    return (
      <>
        <SoundManager activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <Theme activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <FileBubble activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <AudioBubble activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <VideoBubble activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <ImageBubble activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <TextBubble activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <Receipt activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <Badge activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <StatusIndicator activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <Avatar activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <Localize activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <ListItem activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <FormBubble activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <SchedulerBubble activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
        <CardBubble activeComponent={activeComponent} handleCloseComponentModal={handleCloseComponentModal} showComponentModal={showComponentModal} />
      </>
      )
}
export { Shared };