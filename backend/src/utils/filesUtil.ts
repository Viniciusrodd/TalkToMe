
// format file size
export const formatFileSize = (bytes: number): string => {
    if(bytes < 1024){
        return `${bytes} B`
    };
    if(bytes < 1024 * 1024){
        return `${(bytes / 1024).toFixed(2)} KB`
    };
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// extract relevant content
export const extractRelevantContent = (content: string | null, maxLength = 2000): string =>{
    if(!content) return 'No content available';
    // for text: get initial content/resume
    if(content.length <= maxLength){
        return content;
    }
    return `${content.substring(0, maxLength)}... [truncated file]`;
};