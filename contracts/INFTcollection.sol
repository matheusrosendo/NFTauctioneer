// SPDX-License-Identifier: MIT
//@author Matheus Rosendo

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface INFTcollection is IERC721 {
    function tokenURI(uint256 tokenId)
        external
        view
        returns (string memory);
}
