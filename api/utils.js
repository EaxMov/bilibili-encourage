function idType(aidOrVid) {
  return typeof aidOrVid == 'number' ? { aid: aidOrVid } : { bvid: aidOrVid }
}

module.exports = {
  idType
}