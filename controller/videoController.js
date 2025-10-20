const play = require('play-dl');
const fetch = require('node-fetch');

function detectPlatform(url) {
    url = url.toLowerCase();
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'other';
}

exports.videoHandler = async (req, res) => {
    const { url, downloadQuality } = req.body;
    if (!url) return res.status(400).json({ message: 'URL is required' });

    const platform = detectPlatform(url);

    try {
        switch (platform) {

            // ===== YouTube =====
            case 'youtube':
                if (!play.yt_validate(url))
                    return res.status(400).json({ message: 'Invalid YouTube URL' });

                const info = await play.video_info(url);
                const videoDetails = info.video_details;

                // Get available formats (resolutions)
                const formats = info.format.filter(f => f.mimeType.includes('video/mp4'));
                const availableQualities = formats.map(f => ({
                    quality: f.qualityLabel,
                    container: 'mp4',
                    url: f.url,
                    fps: f.fps
                }));

                const metadata = {
                    platform: 'YouTube',
                    title: videoDetails.title,
                    description: videoDetails.description,
                    channel: videoDetails.channel.name,
                    uploadDate: videoDetails.uploadedAt,
                    views: videoDetails.views,
                    duration: videoDetails.durationInSec,
                    availableQualities
                };

                if (downloadQuality) {
                    // Pick requested quality or best available
                    const selectedFormat = formats.find(f => f.qualityLabel === downloadQuality) || formats[0];
                    res.header('Content-Disposition', `attachment; filename="${videoDetails.title.replace(/[^\w\s]/gi, '')}.mp4"`);
                    return res.redirect(selectedFormat.url); // redirect to direct MP4 URL
                }

                return res.json(metadata);


            // ===== TikTok =====
            case 'tiktok': {
                const responseTT = await fetch(url);
                const htmlTT = await responseTT.text();

                const videoUrlMatch = htmlTT.match(/<video.+?src="(.+?)"/);
                const titleMatch = htmlTT.match(/<title>(.*?)<\/title>/);

                const metadataTT = {
                    platform: 'TikTok',
                    title: titleMatch ? titleMatch[1] : 'TikTok Video',
                    videoUrl: videoUrlMatch ? videoUrlMatch[1] : null,
                    availableQualities: ['default']
                };

                if (downloadQuality && videoUrlMatch)
                    return res.redirect(videoUrlMatch[1]);

                return res.json(metadataTT);
            }


            // ===== Instagram =====
            case 'instagram': {
                const responseIG = await fetch(url);
                const htmlIG = await responseIG.text();

                const videoUrlMatch = htmlIG.match(/"video_url":"(.*?)"/);
                const descMatch = htmlIG.match(/"edge_media_to_caption":\{"edges":\[\{"node":\{"text":"(.*?)"\}\}\]\}/);

                const metadataIG = {
                    platform: 'Instagram',
                    title: descMatch ? descMatch[1] : 'Instagram Video',
                    videoUrl: videoUrlMatch ? videoUrlMatch[1].replace(/\\u0026/g, '&') : null,
                    availableQualities: ['default']
                };

                if (downloadQuality && videoUrlMatch)
                    return res.redirect(videoUrlMatch[1].replace(/\\u0026/g, '&'));

                return res.json(metadataIG);
            }


            // ===== Other platforms =====
            default:
                return res.json({ platform, message: 'Full metadata not available. Use direct URL for download.' });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error processing video', error: err.message });
    }
};
