import qualitiesLivestreamer from "./qualities/livestreamer";
import qualitiesStreamlink from "./qualities/streamlink";


const createPresetObj = ( presets, preset ) => {
	presets[ preset.id ] = preset;
	return presets;
};
const qualitiesByIdLivestreamer = qualitiesLivestreamer.reduce( createPresetObj, {} );
const qualitiesByIdStreamlink = qualitiesStreamlink.reduce( createPresetObj, {} );


export {
	qualitiesLivestreamer,
	qualitiesStreamlink,
	qualitiesByIdLivestreamer,
	qualitiesByIdStreamlink
};

export default qualitiesStreamlink;
