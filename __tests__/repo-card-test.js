import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import RepoCard from '../src/components/repo-card'

test('render RepoCard', () => {
  const item = {
    owner: {
      avatar_url: 'http://example.com/aa.jpg',
    },
  }
  const repoCard = renderer.create(
    <RepoCard
      item={item}
    />,
  ).toJSON()
  console.log(repoCard)
})
