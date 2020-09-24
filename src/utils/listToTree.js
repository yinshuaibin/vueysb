export default function listToTree (list) {
  if (!list) {
    return null
  }
  const temp = []
  const tree = {}
  for (const i in list) {
    temp[list[i].id] = list[i]
  }
  for (const i in temp) {
    if (temp[i].parentId) {
      if (!temp[temp[i].parentId].children) {
        temp[temp[i].parentId].children = []
      }
      temp[temp[i].parentId].children[temp[i].id] = temp[i]
    } else {
      tree[temp[i].id] = temp[i]
    }
  }
  return tree
}
