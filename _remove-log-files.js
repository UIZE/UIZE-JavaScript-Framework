var _fileSystemObject = new ActiveXObject ('Scripting.FileSystemObject');

function _deleteFile (_filePath) {
	try {_fileSystemObject.DeleteFile (_filePath)} catch (e) {}
}

_deleteFile ('*.log');

