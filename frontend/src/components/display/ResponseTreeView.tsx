import { Box } from '@mui/material'
import { type TreeViewDefaultItemModelProperties } from '@mui/x-tree-view/models'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import React from 'react'
import type { Finding } from './types'




const transformDataForTree = (data: Finding[]): TreeViewDefaultItemModelProperties[] => {

    const ret = data.map((file, fileIndex) => {

        const fileItem: TreeViewDefaultItemModelProperties = {
            id: `file-${file.filename}-${fileIndex}`,
            label: file.filename,
        }

        if (file.detectors) {
            fileItem.children = Object.entries(file.detectors).map(([detectorName, details]) => {
                const detectorItem: TreeViewDefaultItemModelProperties = {
                    id: `detector-${file.filename}-${fileIndex}-${detectorName}`,
                    label: detectorName,
                    children: details.matches.map((match, matchIndex) => ({
                        id: `match-${file.filename}-${fileIndex}-${detectorName}-${matchIndex}`,
                        label: `entropy: ${match.entropy} | ${match.string}`,
                    }))
                }
                return detectorItem
            })
        } else if (file.error) {
            const errorItem: TreeViewDefaultItemModelProperties = {
                id: `error-${file.filename}-${fileIndex}`,
                label: file.error || "Error",
            }

            fileItem.children = [errorItem]
        }

        return fileItem
    })

    return ret
}


export default function ResponseTreeView({ data }: { data: Finding[] }) {
    // Use useMemo and return an empty array if scanData is null
    const treeItems = React.useMemo(() => {
        if (!data) return []
        return transformDataForTree(data)
    }, [data])

    if (!data) return null // Or a loading skeleton

    return (
        <Box sx={{ flexGrow: 1, mb: '2rem' }}>
            <RichTreeView items={treeItems} />
        </Box>
    )
}
