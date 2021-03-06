export const ACCEPT_CONFIG = {
    image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
    video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv'],
    audio: ['.mp3', '.wav', '.wma', '.ogg', '.aac', '.flac'],
    document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff' , '.zip', '.rar', '.js', '.html'],
    getAll(){
        return [...this.image, ...this.video, ...this.document]
    },
};