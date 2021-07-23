pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

import "./ERC721Full.sol";

contract Color is ERC721Full {
    string[] public colors;
    mapping(string => bool) _colorExists;
    mapping(uint256 => address) public colorToOwner;

    constructor() public ERC721Full("Color", "COLOR") {}

    // E.G. color = "#FFFFFF"
    function mint(string memory _color) public {
        require(!_colorExists[_color]);
        uint256 _id = colors.push(_color);
        _mint(msg.sender, _id);
        _colorExists[_color] = true;
        colorToOwner[_id - 1] = msg.sender;
    }

    function getColorsByOwner(address _owner)
        external
        view
        returns (string[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        string[] memory result = new string[](ownerTokenCount);
        uint256 counter = 0;
        for (uint256 i = 0; i < colors.length; i++) {
            if (colorToOwner[i] == _owner) {
                result[counter] = colors[i];
                counter = counter.add(1);
            }
        }
        return result;
    }
}
